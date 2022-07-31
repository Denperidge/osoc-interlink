//import twentytwo from './data/2022.json';


// Functions
function slug(value: string){
    return value.toLowerCase().replace(' ', '-');
}

// Globals
let partners : {[slug: string]: Partner;} = {};
let participants : {[slug: string]: Participant;} = {};
let projects : {[id: string]: Partner;} = {};

// Interface of Team object found in data
interface TeamIds {
    students: Array<string>
    coaches: Array<string>
}

interface RawProject {
    name: string;
    description: string;
    team: TeamIds,
    repository: string,
    website: string,
    partners: Array<string>
}

// Classes
class Project {
    id: string;
    name: string;
    description: string;
    logo?: URL;
    team: Team;
    repository?: URL;
    website?: URL;
    partners: Array<Partner>;

    // Contsructor based off the json impelementation for the website
    constructor(name : string, description : string, teamIds: TeamIds, repository: string|URL, partners : Array<string>, website?: string|URL) {
        //if (website instanceof ) website = 
        this.id = slug(name)
        this.name = name;
        this.description = description;
        this.team = new Team(teamIds);
        if (repository) this.repository = new URL (repository);
        if (website) this.website = new URL(website);
        this.partners = partners;
    }
}


class Partner {

}


class Team {
    participants: Array<Participant>;

    constructor(teamIds: TeamIds) {
        this.participants = [];
        let rawParticipants = teamIds.students.concat(teamIds.coaches);
        rawParticipants.forEach((participantId) => {
            this.participants.push(participants[participantId]);
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
    name: string;
    coach: boolean;

    constructor (name: string, coach : boolean) {
        this.name = name;
        this.coach = coach;
    }
}

async function main() {
    let twentytwo = await (await fetch('data/2022.json')).json();
    
    twentytwo.projects.forEach((project: RawProject) => {
        console.log(project)
        
        projects[project.name] = new Project(
            project.name,
            project.description,
            project.team,
            project.repository || '',
            project.partners,
            project.website || ''
        );
        console.log(projects[project.name])
    });
    
}

main();
