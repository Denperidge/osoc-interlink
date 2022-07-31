import twentytwo from './data/2022.json';

// Globals
let partners : {[slug: string]: Partner;} = {};
let students : {[slug: string]: Partner;} = {};
let projects : {[id: string]: Partner;} = {};

// Interface of Team object found in data
interface Team {
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
    constructor(id : string, name : string, description : string, logo : string, team: Team, repository: string|URL, partners : Array<string>, website?: string|URL) {
        //if (website instanceof ) website = 
        this.id = id;
        this.name = name;
        this.description = description;
        this.logo = new URL(logo);
        this.team = team;
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

interface Person {
    name: String;
}

class Student implements Person {
    name: String;
}

class Coach implements Person {
    name: String;
}
