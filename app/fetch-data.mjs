import axios from 'axios';
import { mkdirSync, writeFileSync } from 'fs';

const baseDir = 'build/data/'
const baseUrl = 'https://raw.githubusercontent.com/opensummerofcode/website/master/public/editions/';


mkdirSync(baseDir, {recursive: true});

// Combine all data into one file
async function download(year) {
    let data = {};

    let files = ['projects', 'participants', 'partners'];
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let response = await axios.get(`${baseUrl}/${year}/${file}.json`);
        data[file] = response.data;
    }

    console.log("-------")
    console.log(data);
    let dataString = JSON.stringify(data);
    /**
     * I know this looks oddly specific, but its just a (seemingly) inconsistency
     * in the original naming scheme of the OSOC data
     */
    dataString = dataString.replace(/abraham-kakooza/g, 'abraham-jerry-kakooza')
 


    writeFileSync(`${baseDir}/${year}.json`, dataString, {encoding: 'utf-8'});

    
}




[2022, 2021, 2020].forEach((year) => {
    console.log(download(year));
});
