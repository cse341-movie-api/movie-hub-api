const dotenv = require('dotenv');
dotenv.config();
// testing
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB_URI;

let db;

const connectToDatabase = (callback) => {
    if (db) {
        callback(null, db);
    }
    MongoClient.connect(url).then(client => {
        db = client.db('movie_api_db');
        callback(null, db);
    }).catch(err => {
        console.error('Failed to connect to the database:', err);
        callback(err);
    });
}

const getDb = () => {
    if (!db) {
        throw new Error('Database not connected.');
    }
    return db;
}

module.exports = {
    connectToDatabase,
    getDb
};