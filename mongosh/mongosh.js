db.companies.insertOne({
    name: 'Fresh Apples Inc',
    isStartup: true,
    employees: 33,
    funding: 12341234567890,
    details: { ceo: 'Viktor Palchynskyi' },
    tags: [{ title: 'super' }, { title: 'perfect' }],
    foudingDate: new Date(),
    insertedAt: new Timestamp(),
});

db.stats();

var dsid = db.patients.findOne().diseaseSummary;

db.users.aggregate([
    {
        $lookup: {
            from: 'books',
            localField: 'fvBooks',
            foreignField: '_id',
            as: 'books',
        },
    },
])[
    {
        _id: ObjectId('66d5b3fb871ef4e9105e73ad'),
        name: 'Viktor',
        fvBooks: [
            ObjectId('66d5b3bf871ef4e9105e73ab'),
            ObjectId('66d5b3bf871ef4e9105e73ac'),
        ],
        books: [
            {
                _id: ObjectId('66d5b3bf871ef4e9105e73ac'),
                name: 'Martin Iden',
            },
            {
                _id: ObjectId('66d5b3bf871ef4e9105e73ab'),
                name: 'Mobidick',
            },
        ],
    }
];
b.users.aggregate([
    {
        $lookup: {
            from: 'books',
            localField: 'fvBooks',
            foreignField: '_id',
            as: 'fvBooks',
        },
    },
])[
    {
        _id: ObjectId('66d5b3fb871ef4e9105e73ad'),
        name: 'Viktor',
        fvBooks: [
            {
                _id: ObjectId('66d5b3bf871ef4e9105e73ac'),
                name: 'Martin Iden',
            },
            {
                _id: ObjectId('66d5b3bf871ef4e9105e73ab'),
                name: 'Mobidick',
            },
        ],
    }
];

db.createCollection('posts', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['title', 'text', 'creator', 'comments'],
            properties: {
                title: {
                    bsonType: 'string',
                },
                text: {
                    bsonType: 'string',
                },
                creator: {
                    bsonType: 'objectId',
                },
                comments: {
                    bsonType: 'array',
                    items: {
                        bsonType: 'object',
                        required: ['text', 'author'],
                        properties: {
                            text: {
                                bsonType: 'string',
                            },
                            author: {
                                bsonType: 'objectId',
                            },
                        },
                    },
                },
            },
        },
    },
});

db.runCommand({
    collMod: 'posts',
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['title', 'text', 'creator', 'comments'],
            properties: {
                title: {
                    bsonType: 'string',
                    description: 'must be a string and is required',
                },
                text: {
                    bsonType: 'string',
                    description: 'must be a string and is required',
                },
                creator: {
                    bsonType: 'objectId',
                    description:
                        'must be an objectid and is required',
                },
                comments: {
                    bsonType: 'array',
                    description: 'must be an array and is required',
                    items: {
                        bsonType: 'object',
                        required: ['text', 'author'],
                        properties: {
                            text: {
                                bsonType: 'string',
                                description:
                                    'must be a string and is required',
                            },
                            author: {
                                bsonType: 'objectId',
                                description:
                                    'must be an objectid and is required',
                            },
                        },
                    },
                },
            },
        },
    },
    validationAction: 'warn',
});

// sudo mongod --dbpath /var/lib/mongodb/db --logpath /var/lib/mongodb/logs/log.log
// sudo mongod --fork --logpath ~/testLogs/

// ------------------------------------------------------------------------------CREATE OPERATIONS------------------------------------------------------------------------------------------------

db.hobbies.insertMany(
    [
        { name: 'Sport' },
        { _id: 'cooking', name: 'Cooking' },
        { _id: 'cars', name: 'Cars' },
    ],
    { ordered: false }
);

db.person.insertOne(
    { name: 'Alya', age: 58 },
    { writeConcern: { w: 1, j: true, wtimeout: 200 } }
);

// mongoimport tv-shows.json -d movieData -c movies --jsonArray --drop

// -------------------------------------------------------------------------------READ OPERATIONS----------------------------------------------------------------------------------------------

db.movies.find({ runtime: { $ne: 60 } });

// objects
db.movies.find({ 'rating.average': { $gte: 9.4 } });
db.movies.find({ 'network.country.code': 'JP' });

// arrays
db.movies.find({ genres: 'Drama' });
db.movies.find({ genres: ['Drama'] });

// $in $nin
db.movies.find({ runtime: { $in: [30, 42] } });
db.movies.find({ runtime: { $nin: [30, 42] } });

// $or $nor

db.movies
    .find({
        $or: [
            { 'rating.average': { $lt: 5 } },
            { 'rating.average': { $gt: 9.3 } },
        ],
    })
    .count();

db.movies
    .find({
        $nor: [
            { 'rating.average': { $lt: 5 } },
            { 'rating.average': { $gt: 9.3 } },
        ],
    })
    .count();

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
