//import twentytwo from './data/2022.json';

const ASSETURL = 'https://raw.githubusercontent.com/opensummerofcode/website/master/public/';

// Functions
function slug(value: string){
    // Accent removal source: https://stackoverflow.com/a/37511463
    return value.toLowerCase().replace(/--/g, '-').replace(/\s\s/g, ' ').replace(/ /g, '-').normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

// Globals
let allPartners : {[slug: string]: Partner;} = {};
let allParticipants : {[slug: string]: Participant;} = {};
let allProjects : Array<Project> = [];


/**
 * ==================== Project ====================
 * The projects, worked on by a @see Team and @see Partner
 */
// Projects as structured in the OSOC JSON files
interface RawProject {
    name: string;
    description: string;
    team: RawTeam,
    repository: string,
    website: string,
    partners: Array<string>
}
// Projects after being parsed
class Project {
    id: string;
    name: string;
    description: string;
    team: Team;
    repository?: URL;
    website?: URL;
    partners: Array<Partner>;
    year: number;

    // Contsructor based off the json impelementation for the website
    constructor(year: number, name : string, description : string, teamIds: RawTeam, repository: string|URL, partners : Array<string>, website?: string|URL) {
        //if (website instanceof ) website = 
        this.year = year;
        this.id = slug(name)
        console.log(this.id)
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

    get logo() : string {
        return `${ASSETURL}/editions/${this.year}/projects/${this.id}.svg`;
    }

    toHTML(topHeader : number, expand=true) : string {
        let h1 = `h${topHeader}`;
        let h2 = `h${topHeader+1}`;
        let h3 = `h${topHeader+2}`;
        

        let data = `<${h1}>${this.name}</${h1}><p>${this.description}</p>`;

        data += `<img alt="logo for ${this.name}" src="${this.logo}" />`;
        
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

        data += `<${h3}>Partners:</${h3}><ul>`;
        this.partners.forEach((partner) => {
            data += `<li><a href="?partner=${partner.id}">${partner.name}</a>`
        });
        data += '</ul>'

        return data;
    }

    card() : string {
        let data = `
        <article>
            <header>${this.name}</header>
            <img alt="logo for ${this.name}" src="${this.logo}" />
            <p>
                ${this.description}
            </p>
            <footer>
                <a href="?project=${this.id}">View</a>
            </footer>
        </article>
        `;



        return data;
    }
}
/**
 * ==================== Teams ====================
 * The @see Participant 's (students & coaches) that worked on a @see Project
 */
// Teams as structured in the OSOC JSON files
interface RawTeam {
    students: Array<string>
    coaches: Array<string>
}
// Teams after being parsed.
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

/**
 * ==================== Partners ====================
 */
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

    
    toHTML(topHeader : number, expand=true) : string {
        let h1 = `h${topHeader}`;
        let h2 = `h${topHeader+1}`;
        

        let data =`<${h1}>${this.name}</${h1}>`
        data += `<img alt="Logo for ${this.name}" src="${this.logo}" />`;
        data += `<p>Website: <a href="${this.url}">${this.url}</a></p>`;
                   
        
        data += `<${h2}>Projects</${h2}><ul>`;
        this.projects.forEach((project) => {
            data += `<li><a href="?project=${project.id}">${project.name}</a>`
        });
        data += '</ul>'

        return data;
    }
}


/**
 * ==================== Participants ====================
 * Individual participants, working on @see Project s.
 * Can be coaches and/or students
 */
interface RawParticipant {
    name: string;
    socials: {[key: string]: URL};
    coach: boolean;
}

class Participant {
    year: number;
    id: string;
    name: string;
    socials: {[key: string]: URL};
    coach: boolean;

    get image() : string {
        return `${ASSETURL}/editions/${this.year}/participants/${this.id}.jpg`;
    }

    constructor (year : number, name : string, socials: {[key: string]: URL}, coach : boolean) {
        this.year = year; 
        this.id = slug(name);
        this.name = name;
        this.socials = socials;
        this.coach = coach || false;
    }

    toHTML(topHeader : number) : string {
        let h1 = `h${topHeader}`;
        let h2 = `h${topHeader+1}`;

        let data = `<${h1}>${this.name}</${h1}>`;

        data += `<img alt="Photo of ${this.name}" src="${this.image}" />`;
        
        data += `<${h2}>Projects</${h2}>`;
        data += '<div class="grid">';
        this.projects.forEach((project) => { data += project.card()}); 
        data += '</div>';
        /*
        this.projects.forEach((project) => {
            data += `<li><a href="?project=${project.id}">${project.name}</a>`
        });
        data += '</ul>'
        */

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


/**
 * ==================== Main ====================
 * The functions that are being run
 */

/**
 * This function...
 * - Gets the data from local JSON files
 * - Parses it into objects ( @see Participant | @see Project | @see Partner )
 * - And saves them globally ( @see allParticipants | @see allProjects | @see allPartners )
 */
async function parseData() {
    let twentytwo = await (await fetch('data/2022.json')).json();

    twentytwo.participants.forEach((rawParticipant : RawParticipant) => {
        let participant = new Participant(2022, rawParticipant.name, rawParticipant.socials, rawParticipant.coach);
        console.log(participant.id)
        allParticipants[participant.id] = participant;
    });

    twentytwo.partners.forEach((rawPartner: RawPartner) => {
        let partner = new Partner(rawPartner);
        allPartners[partner.id] = partner;
    });

    twentytwo.projects.forEach((project: RawProject) => {
        allProjects.push(new Project(
            2022,
            project.name,
            project.description,
            project.team,
            project.repository || '',
            project.partners,
            project.website || ''
        ));
    });
}

/**
 * This function...
 * - If there's no ?query=set, show all projects seperated by lines
 * - If there is a query, check what is being queried, and display it interactively
 */
function displayData() {
    let search = window.location.search.substring(1);
    if (!search) {
        let data = '';
        allProjects.forEach((project) => {
            console.log(project.name)
            data += project.toHTML(2);
            data += '<br><hr><br>'
        })
        document.body.innerHTML = data;
    }
    else {
        let query = slug(search.substring(search.indexOf('=')+1));  // Remove ? and type=
        console.log(query);
        if (search.startsWith('participant')) {
            document.body.innerHTML = allParticipants[query].toHTML(1);
        }
        else if (search.startsWith('project')) {
            let project = allProjects.find((project) => project.id == query);
            if (project) {
                document.body.innerHTML = project.toHTML(1);
            }
        }
        else if (search.startsWith('partner')) {
            document.body.innerHTML = allPartners[query].toHTML(1);
        }
        
    }
    
    console.log(window.location.search)
}

function main() {
    parseData().then(displayData);
}
main();
