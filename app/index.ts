
// Globals
let partners : {[slug: string]: Partner;} = {};
let students : {[slug: string]: Partner;} = {};
let projects : {[id: string]: Partner;} = {};


// Classes
class Project {
    id: string;
    name: string;
    description: string;
    logo: URL;
    private _teamId: string;
    repository: URL;
    website?: URL;
    partners: Array<Partner>;

    //constructor(id : string, name: string, )
    // Contsructor based off the json impelementation for the website
    //constructor(id : string, name : string, description : string, logo : string, team: Array<string>, repository: string, website?: string);
    constructor(id : string, name : string, description : string, logo : string, team: string, repository: string|URL, website?: string|URL, partners : Array<string>) {
        //if (website instanceof ) website = 
        this.id = id;
        this.name = name;
        this.description = description;
        this.logo = new URL(logo);
        this._teamId = team;
        this.repository = new URL (repository);
        if (website) this.website = new URL(website);
        this.partners = 
    }

    set team(value : string|Team) {
        if (value instanceof Team) {
            this._teamId = value.id;
        } else {
            this._teamId = value;
        }
    }

    get team() : Team {
        return this.team;
    }


}

class Partner {

}

class Team {
    students: Array<Student>;
    coaches: Array<Coach>;
    id : string;

    
}

interface Person {
    name: String;
}

class Student extends Person {

}

class Coach extends Person {

}
