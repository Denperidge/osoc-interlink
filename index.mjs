import { MongoClient } from 'mongodb';

const uri = 'mongodb://root:example@localhost:27017';

const client = new MongoClient(uri);


async function main() {
    await client.connect();

    let osoc = client.db('osoc');

    await osoc.command({ping: 1})

}
main();