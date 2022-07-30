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
        return readFileSync(filename);
    } else {
        let res :AxiosResponse = await axios.get(`https://osoc.be/_next/data/MXVWpqKkNw5fEuXKCEO5X/editions/${year}.json?year=${year}`);
        let data = res.data;
        
        console.info(`Reading ${year} from website`);

        writeFile(filename, JSON.stringify(data), {encoding: 'utf-8'}, () => { console.log(`Cached to ${filename}`); } );
        return data;
    }
}



async function main() {
    console.log("meow")

    let data = await getOsocYear(2022);

    return;

    //console.log(data)


    console.log(await getOsocYear(2022));
    await client.connect();

    let osoc = client.db('osoc');

    let students : Collection = osoc.collection('students');
    let paricipants : Collection = osoc.collection('participants');
    let projects : Collection = osoc.collection('projects');

    //students.insertMany()
    

    await osoc.command({ping: 1})

}

main();