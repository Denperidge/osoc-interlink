import axios from 'axios';
import { mkdirSync, writeFileSync } from 'fs';

const baseDir = 'build/data/'
const baseUrl = 'https://raw.githubusercontent.com/opensummerofcode/website/master/public/editions/';

function slug(value){
    // Adapted from index.ts. Keep in sync !!
    value = value.toLowerCase().replace(/'/g, '-').replace(/\s\s/g, ' ').replace(/ /g, '-').normalize('NFD').replace(/\p{Diacritic}/gu, '');
    while (value.includes('--')) value = value.replace(/--/g, '-');  // Darn you, double dashes
    return value;
}

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



    /**
     * The participants in OSOC 2021/2022 had id's that were a slug of their full name. Cool, easy, all fine.
     * 2020 has uuid's, which meant that they - as it stand - are seen as separate 
     * The mugshots will make sure that we don't need to keep the old id in the Participant object,
     * but the projects do still use the UUID's, so replace them there.
     */
    
    if (year == 2020) {
        data.participants.forEach((participant, i) => {
            let newId = slug(participant.name);
            let oldId = participant.id;

            // Update the id in the participants array
            data.participants[i].id = newId;

            // Update the id in projects
            data.projects.forEach((project, i) => {
                let students = project.team.students;
                let studentIndex = students.indexOf(oldId);

                if (studentIndex > -1) {
                    students[students.indexOf(oldId)] = newId;

                    data.projects[i].team.students = students;
                }
                
                let coaches = project.team.coaches;
                let coachIndex = coaches.indexOf(oldId);

                if (coachIndex > -1) {
                    coaches[coachIndex] = newId;
                    data.projects[i].team.coaches = coaches;
                }
            });
        });
    }

    if (year == 2019) {
        data.participants.forEach((participant, i) => {
            let newId = participant.id.replace(/_/g, '-');
            let oldId = participant.id;

            // Update the id in the participants array
            data.participants[i].id = newId;

            // Update the id in projects
            data.projects.forEach((project, i) => {
                let students = project.team.students;
                let studentIndex = students.indexOf(oldId);

                if (studentIndex > -1) {
                    students[students.indexOf(oldId)] = newId;

                    data.projects[i].team.students = students;
                }
                
                let coaches = project.team.coaches;
                let coachIndex = coaches.indexOf(oldId);

                if (coachIndex > -1) {
                    coaches[coachIndex] = newId;
                    data.projects[i].team.coaches = coaches;
                }
            });
        });
    }


    let dataString = JSON.stringify(data);
    

    /**
     * I know this looks oddly specific, but its just a (seemingly) inconsistency
     * in the original naming scheme of the OSOC data
     */
    dataString = dataString.replace(/abraham-kakooza/g, 'abraham-jerry-kakooza');
    // Jodi's most recent id is jodi-deloof, but his old id is jodi-de-loof. So fix that!
    dataString = dataString.replace(/jodi-de-loof/g, 'jodi-deloof');
    dataString = dataString.replace(/carlos-ruiz-herrera/g, 'carlos-emiliano-ruiz-herrera');


    writeFileSync(`${baseDir}/${year}.json`, dataString, {encoding: 'utf-8'});

    
}




[2022, 2021, 2020, 2019].forEach((year) => {
    console.log(download(year));
});
