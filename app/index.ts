//import twentytwo from './data/2022.json';


// Functions
function slug(value: string){
    return value.toLowerCase().replace(' ', '-');
}

// Globals
let partners : {[slug: string]: Partner;} = {};
let students : {[slug: string]: Partner;} = {};
let projects : {[id: string]: Partner;} = {};

// Interface of Team object found in data
interface TeamIds {
    students: Array<string>
    coaches: Array<string>
}

// Classes
class Project {
    id: string;
    name: string;
    description: string;
    logo: URL;
    team: Team;
    repository: URL;
    website?: URL;
    partners: Array<Partner>;

    // Contsructor based off the json impelementation for the website
    constructor(name : string, description : string, teamIds: TeamIds, repository: string|URL, partners : Array<string>, website?: string|URL) {
        //if (website instanceof ) website = 
        this.id = slug(name)
        this.name = name;
        this.description = description;
        this.logo = new URL('');
        this.team = teamIds;
        this.repository = new URL (repository);
        if (website) this.website = new URL(website);
        this.partners = partners;
    }
}


class Partner {

}


class Team {
    /*
    students: Array<Student>;
    coaches: Array<Coach>;
    id : string;

    */
}

class Participant {
    name: string;

    constructor (name: string) {
        this.name = name;
    }
}

async function main() {
    let twentytwo = await (await fetch('data/2022.json')).json();
    console.log(twentytwo)
    twentytwo.projects.forEach((project: Project) => {
        console.log(project)

        /*
        projects[project.name] = new Project(
            project.name,
            project.description,
            project.team,
            project.repository || '',
            project.partners,
            project.website || ''
        );
        */
    });
    
}

main();
