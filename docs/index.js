"use strict";
//import twentytwo from './data/2022.json';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Functions
function slug(value) {
    return value.toLowerCase().replace(/ /g, '-');
}
// Globals
let allPartners = {};
let allParticipants = {};
let allProjects = [];
// Classes
class Project {
    // Contsructor based off the json impelementation for the website
    constructor(name, description, teamIds, repository, partners, website) {
        //if (website instanceof ) website = 
        this.id = slug(name);
        this.name = name;
        this.description = description;
        this.team = new Team(teamIds);
        if (repository)
            this.repository = new URL(repository);
        if (website)
            this.website = new URL(website);
        this.partners = partners;
    }
    interactive(topHeader) {
        let h1 = `h${topHeader}`;
        let h2 = `h${topHeader + 1}`;
        let h3 = `h${topHeader + 2}`;
        let data = `<${h1}>${this.name}</${h1}><p>${this.description}</p>`;
        if (this.repository || this.website) {
            data += '<ul>';
            if (this.repository)
                data += `Repository: <a href=${this.repository.toString()}">${this.repository.toString()}</a>`;
            if (this.website)
                data += `Website: <a href=${this.website.toString()}">${this.website.toString()}</a>`;
            data += '<ul>';
        }
        data += `<${h2}>Team</${h2}>`;
        data += `<${h3}>Coaches:</${h3}><ul>`;
        this.team.coaches.forEach((participant) => {
            data += `<li><a href="/?participant=${participant.id}">${participant.name}</a>`;
        });
        data += '</ul>';
        data += `<${h3}>Students:</${h3}><ul>`;
        this.team.coaches.forEach((participant) => {
            data += `<li><a href="/?participant=${participant.id}">${participant.name}</a>`;
        });
        data += '</ul>';
        return data;
    }
}
class Partner {
}
class Team {
    constructor(teamIds) {
        this.participants = [];
        let rawParticipants = teamIds.students.concat(teamIds.coaches);
        console.log(rawParticipants);
        rawParticipants.forEach((participantId) => {
            this.participants.push(allParticipants[participantId]);
        });
    }
    get students() {
        return this.participants.filter((participant) => participant.coach == false);
    }
    get coaches() {
        return this.participants.filter((participant) => participant.coach == true);
    }
}
class Participant {
    constructor(name, socials, coach) {
        this.id = slug(name);
        this.name = name;
        this.socials = socials;
        this.coach = coach;
    }
    interactive(topHeader) {
        let h1 = `h${topHeader}`;
        let h2 = `h${topHeader + 1}`;
        let data = `<${h1}>${this.name}</${h1}>`;
        data += `<${h2}>Projects</${h2}><ul>`;
        this.projects.forEach((project) => {
            data += `<li><a href="/?project=${project.id}">${project.name}</a>`;
        });
        data += '</ul>';
        let socials = Object.keys(this.socials);
        if (socials.length > 0) {
            data += `<${h2}>Socials</${h2}>`;
            data += `<ul>`;
            socials.forEach((socialName) => {
                console.log(socialName);
                let socialUrl = this.socials[socialName].toString();
                console.log(socialUrl);
                let socialUsername = socialUrl.split('/')[3]; //socialUrl.substring(socialUrl.lastIndexOf('/')+1)
                data += `    <li>${socialName} - 
                    <a href="${socialUrl}">${socialUsername}</a></li>`;
            });
            data += `</ul>`;
        }
        return data;
    }
    get projects() {
        return allProjects.filter((project) => project.team.participants.includes(this));
    }
}
function parseData() {
    return __awaiter(this, void 0, void 0, function* () {
        let twentytwo = yield (yield fetch('data/2022.json')).json();
        twentytwo.participants.forEach((rawParticipant) => {
            let participant = new Participant(rawParticipant.name, rawParticipant.socials, rawParticipant.coach);
            allParticipants[participant.id] = participant;
        });
        console.log(allParticipants);
        console.log('---------');
        twentytwo.projects.forEach((project) => {
            allProjects.push(new Project(project.name, project.description, project.team, project.repository || '', project.partners, project.website || ''));
        });
    });
}
function print(data) {
    //document.body.innerHTML = data;
}
function displayData() {
    if (!window.location) {
        //document.body.innerHTML =     
    }
    document.body.innerHTML = allParticipants['cat-catry'].interactive(1);
    console.log(window.location.search);
}
parseData().then(displayData);
