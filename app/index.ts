//import twentytwo from './data/2022.json';

const ASSETURL = 'https://raw.githubusercontent.com/opensummerofcode/website/master/public/';

// Functions
function slug(value: string){
    // Accent removal source: https://stackoverflow.com/a/37511463
    return value.toLowerCase().replace(/ /g, '-').normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

// Globals
let allPartners : {[slug: string]: Partner;} = {};
let allParticipants : {[slug: string]: Participant;} = {};
let allProjects : Array<Project> = [];

// Interface of Team object found in data
interface RawParticipant {
    name: string;
    socials: {[key: string]: URL};
    coach: boolean;
}

interface RawTeam {
    students: Array<string>
    coaches: Array<string>
}

interface RawProject {
    name: string;
    description: string;
    team: RawTeam,
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
    constructor(name : string, description : string, teamIds: RawTeam, repository: string|URL, partners : Array<string>, website?: string|URL) {
        //if (website instanceof ) website = 
        this.id = slug(name)
        this.name = name;
        this.description = description;
        this.team = new Team(teamIds);
        if (repository) this.repository = new URL (repository);
        if (website) this.website = new URL(website);
        this.partners = [];
        partners.forEach((partnerId) => {
            this.partners.push(allPartners[partnerId]);
        });
    }

    interactive(topHeader : number) : string {
        let h1 = `h${topHeader}`;
        let h2 = `h${topHeader+1}`;
        let h3 = `h${topHeader+2}`;
        

        let data = `<${h1}>${this.name}</${h1}><p>${this.description}</p>`;
        
        if (this.repository || this.website) {
            data += '<ul>';
            if (this.repository) data += `<li>Repository: <a href=${this.repository.toString()}">${this.repository.toString()}</a></li>`;
            if (this.website) data += `<li>Website: <a href=${this.website.toString()}">${this.website.toString()}</a></li>`;
            data += '</ul>'
        }

        data += `<${h2}>Team</${h2}>`;
        
        data += `<${h3}>Coaches:</${h3}><ul>`;
        this.team.coaches.forEach((participant) => {
            data += `<li><a href="?participant=${participant.id}">${participant.name}</a>`
        });
        data += '</ul>'

        data += `<${h3}>Students:</${h3}><ul>`;
        this.team.students.forEach((participant) => {
            data += `<li><a href="?participant=${participant.id}">${participant.name}</a>`
        });
        data += '</ul>'

        return data;
    }
}

interface RawPartner {
    id: string;
    name: string;
    url: string;
    logo: string;
}

class Partner {
    id: string;
    name: string;
    url: URL;
    logo: URL;

    constructor(rawPartner : RawPartner) {
        this.id = rawPartner.id;
        this.name = rawPartner.name;
        this.url = new URL(rawPartner.url);
        this.logo = new URL(ASSETURL + rawPartner.logo);

    }

    get projects() : Array<Project> {
        return allProjects.filter((project) => project.partners.includes(this))
    }
}


class Team {
    participants: Array<Participant>;

    constructor(teamIds: RawTeam) {
        this.participants = [];
        let rawParticipants = teamIds.students.concat(teamIds.coaches);
        
        rawParticipants.forEach((participantId) => {
            if (!allParticipants[participantId]) {
                console.log("=============")
                console.log(participantId);
                console.log("=============")

            }
            this.participants.push(allParticipants[participantId]);
        });
    }
    
    get students() : Array<Participant> {
        return this.participants.filter((participant) => participant.coach == false);
    }
    get coaches() {
        console.log(this.participants)
        return this.participants.filter((participant) => participant.coach == true);
    }
}

class Participant {
    id: string;
    name: string;
    socials: {[key: string]: URL};
    coach: boolean;

    constructor (name: string, socials: {[key: string]: URL}, coach : boolean) {
        this.id = slug(name);
        this.name = name;
        this.socials = socials;
        this.coach = coach || false;
    }

    interactive(topHeader : number) : string {
        let h1 = `h${topHeader}`;
        let h2 = `h${topHeader+1}`;

        let data = `<${h1}>${this.name}</${h1}>`;
        
        data += `<${h2}>Projects</${h2}><ul>`;
        this.projects.forEach((project) => {
            data += `<li><a href="?project=${project.id}">${project.name}</a>`
        });
        data += '</ul>'

        let socials = Object.keys(this.socials);
        if (socials.length > 0) {
            data += `<${h2}>Socials</${h2}>`
            data += `<ul>`;
            socials.forEach((socialName : string) => {
                let socialUrl = this.socials[socialName].toString();
                let socialUsername = socialUrl.split('/')[3] //socialUrl.substring(socialUrl.lastIndexOf('/')+1)

                data += `    <li>${socialName} - 
                    <a href="${socialUrl}">${socialUsername}</a></li>`;
            })

            data += `</ul>`;
        }
        
        return data;
    }
    
    get projects() : Array<Project> {
        return allProjects.filter((project) => project.team.participants.includes(this))
    }
    
}

async function parseData() {
    let twentytwo = await (await fetch('data/2022.json')).json();

    twentytwo.participants.forEach((rawParticipant : RawParticipant) => {
        let participant = new Participant(rawParticipant.name, rawParticipant.socials, rawParticipant.coach);
        allParticipants[participant.id] = participant;
    });

    twentytwo.partners.forEach((rawPartner: RawPartner) => {
        let partner = new Partner(rawPartner);
        allPartners[partner.id] = partner;
    });

    twentytwo.projects.forEach((project: RawProject) => {
        allProjects.push(new Project(
            project.name,
            project.description,
            project.team,
            project.repository || '',
            project.partners,
            project.website || ''
        ));
    });
}


function print(data : Participant|Project) {
    //document.body.innerHTML = data;
}

function displayData() {
    let search = window.location.search.substring(1);
    if (!search) {
        let data = '';
        allProjects.forEach((project) => {
            console.log(project.name)
            data += project.interactive(2);
            data += '<br><hr><br>'
        })
        document.body.innerHTML = data;
    }
    else {
        let query = slug(search.substring(search.indexOf('=')+1));  // Remove ? and type=
        console.log(query);
        if (search.startsWith('participant')) {
            document.body.innerHTML = allParticipants[query].interactive(1);
        }
        else if (search.startsWith('project')) {
            let project = allProjects.find((project) => project.id == query);
            if (project) {
                document.body.innerHTML = project.interactive(1);
            }
        }
        
    }

    console.log(allPartners)

    
    console.log(window.location.search)
}

parseData().then(displayData);
