const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const mongoDbUrl =
    'mongodb+srv://VP:kjzVcCImI3Sidynn@cluster0.z1qfk.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0';

let _db;

const initDb = (cb) => {
    if (_db) {
        console.log('Database is already initialized!');

        return cb(null, _db);
    }

    MongoClient.connect(mongoDbUrl)
        .then((client) => {
            _db = client;
                
            cb(null, _db);
        })
        .catch((err) => {
            cb(err);
        });
};

const getDb = () => {
    if (!_db) {
        throw new Error('Database not initialized');
    }

    return _db;
};

module.exports = {
    initDb,
    getDb,
};
