import mongoose, { connect, disconnect, model, Schema, Document } from 'mongoose';
import axios, { AxiosResponse } from 'axios';
import { existsSync, readFileSync, writeFile, mkdir } from 'fs';

// Consts
const uri : string = 'mongodb://root:example@localhost:27017';
const buildDir : string = 'build/';
const cacheDir : string = buildDir + 'cache/'


async function getOsocYear(year : Number) {
    let filename = `${cacheDir}/${year}.json`;
    if (existsSync(filename)) {
        console.info(`Reading ${year} from cache`);
        return JSON.parse(readFileSync(filename, {encoding: 'utf-8'})) as YearData;
    } else {
        let res :AxiosResponse = await axios.get(`https://osoc.be/_next/data/MXVWpqKkNw5fEuXKCEO5X/editions/${year}.json?year=${year}`);
        let data : YearData = res.data.pageProps;

        console.info(`Reading ${year} from website`);

        writeFile(filename, JSON.stringify(data), {encoding: 'utf-8'}, () => { console.log(`Cached to ${filename}`); } );
        return data;
    }
}

interface YearData {
    //[key: string]: Array<any>
    partners: Array<any>
    participants: Array<any>
    projects: Array<any>
}

// Schemas
const partnerSchema = new Schema({
    _id: String,
    name: String,
    url: String,
    logo: String
});
const participantSchema = new Schema({
    _id: String,
    name: String,
    socials: {
        stuff: String
     },
    coach: Boolean
});
const projectSchema = new Schema({
    _id: String,
    name: String,
    description: String,
    team: { students: [participantSchema], coaches: [participantSchema] }
});
const Partner = model('Partner', partnerSchema);
const Participant = model('Participant', participantSchema);
const Project = model('Project', projectSchema);


/**
 * @link https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/write-operations/pkFactory/
 * 
 * @param objects the objects to give a _id
 * @param field the field that has to be converted to a slug and set to _id
 * 
 * @returns the objects array, but modified to have _id = slug of field value
 */
function giveIds(objects: Array<{[key : string] : string, data : any}>, field : string) {
    objects.forEach((object) => {
        let slugFromField = object[field].toLowerCase().replace(' ', '-');
        object._id = slugFromField;
    })
    return objects;
}
function giveId(object : {[key : string] : string, data : any}, field : string) {
    object._id = slug(object[field]);
    return object;
}


function slug(value: string){
    return value.toLowerCase().replace(' ', '-');
}


// Startup, initialization
async function init() {
    // Connect to database
    let promises = [];

    promises.push(connect(uri));
    
    if (!existsSync(cacheDir)) {
        promises.push(mkdir(cacheDir, () => { console.info(`Created ${cacheDir}`); } ));
    }

    return Promise.all(promises);
}


let participants : { [key: string]: Document } = {};

// Do the things
async function main() {
    // Get data from year
    let data : YearData = await getOsocYear(2022);

    let rawParticipants = data.participants;

    for (let i=0; i < rawParticipants.length; i++) {
        let rawParticipant = rawParticipants[i];

        if (!rawParticipant.coach) rawParticipant.coach = false;
        rawParticipant = giveId(rawParticipant, 'name');

        let participant = new Participant(rawParticipant);

        participants[rawParticipant.name] = participant;
        await participant.updateOne(participant, {upsert: true});
    }
}

// Clean up and exit
async function exit() {
    await disconnect();
}

init().then(main).then(exit);
