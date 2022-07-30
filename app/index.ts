import { Collection, MongoClient } from 'mongodb';
import axios, { AxiosResponse } from 'axios';
import { existsSync, readFileSync, writeFile, mkdirSync } from 'fs';

// Consts
const uri : string = 'mongodb://root:example@localhost:27017';
const buildDir : string = 'build/';
const cacheDir : string = buildDir + 'cache/'

const client : MongoClient = new MongoClient(uri);

if (!existsSync(cacheDir)) {
    mkdirSync(cacheDir);
}


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
    partners: Array<any>
    participants: Array<any>
    projects: Array<any>
}


/**
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



async function main() {
    console.log("meow")

    let data : YearData = await getOsocYear(2022);

    data.participants = giveIds(data.participants, 'name');
    console.log(data.participants);


    await client.connect();
    
    let osoc = client.db('osoc');

    

    let partners : Collection = osoc.collection('partners');
    let participants : Collection = osoc.collection('participants');
    let projects : Collection = osoc.collection('projects');


    participants.insertMany(data.participants);
    //students.insertMany()
    

    await osoc.command({ping: 1})

    await client.close();

}

main();