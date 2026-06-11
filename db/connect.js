const dotenv = require('dotenv');
dotenv.config();
//testing new
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGO_URL;

const dbName = process.env.MONGO_DB_NAME;
let db;

const connectToDatabase = (callback) => {
    if (db) {
        callback(null, db);
    }
    MongoClient.connect(url).then(client => {
        db = client.db(dbName);
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