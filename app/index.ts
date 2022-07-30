import { Collection, MongoClient } from 'mongodb';
import axios, { AxiosResponse } from 'axios';
import { existsSync, readFileSync, writeFile, mkdir } from 'fs';

// Consts
const uri : string = 'mongodb://root:example@localhost:27017';
const buildDir : string = 'build/';
const cacheDir : string = buildDir + 'cache/'

const client : MongoClient = new MongoClient(uri);


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


// Startup, initialization
async function init() {
    // Connect to database
    let promises = [];

    promises.push(client.connect());
    
    if (!existsSync(cacheDir)) {
        promises.push(mkdir(cacheDir, () => { console.info(`Created ${cacheDir}`); } ));
    }

    return Promise.all(promises);
}

// Do the things
async function main() {
    // Get data from year
    let data : YearData = await getOsocYear(2022);

    
    // Get database and collections within it
    let osoc = client.db('osoc');
    let partners : Collection = osoc.collection('partners');
    let participants : Collection = osoc.collection('participants');
    let projects : Collection = osoc.collection('projects');

    // For every property in data, save in the database with an appropiate indexing _id field
    await partners.insertMany(giveIds(data.partners, 'id'));
    await participants.insertMany(giveIds(data.participants, 'name'));
    await projects.insertMany(giveIds(data.projects, 'name'));
    

    // 
    
}

// Clean up and exit
async function exit() {
    await client.close();
}

init().then(main).then(exit);
