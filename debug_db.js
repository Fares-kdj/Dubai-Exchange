const { MongoClient } = require('mongodb');

async function debugServices() {
    const url = 'mongodb://localhost:27017';
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db('iraq_db');
        const services = await db.collection('services').find({}).toArray();

        console.log('--- Current Services in DB ---');
        services.forEach(s => {
            console.log(`ID: ${s.service_id}`);
            console.log(`Name: ${s.name_en}`);
            console.log(`Route: ${s.route}`);
            console.log(`Is Active: ${s.is_active}`);
            console.log(`Is Hero Pinned: ${s.is_hero_pinned}`);
            console.log('---');
        });
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    } finally {
        await client.close();
    }
}

debugServices();
