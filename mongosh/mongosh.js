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

// -------------------------------------------------------------------------------CREATE OPERATIONS----------------------------------------------------------------------------------------------

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

// $and
// use $and operator if working with one field.

db.movies
    .find({ 'rating.average': { $gt: 9 }, genres: 'Drama' })
    .count();
db.movies
    .find({
        $and: [{ 'rating.average': { $gt: 9 } }, { genres: 'Drama' }],
    })
    .count();

db.movies
    .find({ $and: [{ genres: 'Horror' }, { genres: 'Drama' }] })
    .count();

// $not
// its better to use $ne. may be there are some cases I can use this operator.

db.movies.find({ runtime: { $not: { $eq: 60 } } }).count();

// element operators

db.users.find({ age: { $exists: true } });
db.users.find({ age: { $exists: true, $ne: null } });

//find by type $type

db.users.find({ phone: { $type: 'string' } });
db.users.find({ phone: { $type: ['string', 'double'] } });

// $regex

db.movies.find({ summary: { $regex: /anime/ } });

// $expr

db.movies.find({ $expr: { $gt: ['$runtime', '$weight'] } });
db.movies.find({
    $expr: {
        $gt: [
            {
                $cond: {
                    if: { $gt: ['$weight', 10] },
                    then: { $subtract: ['$weight', 100] },
                    else: '$weight',
                },
            },
            '$runtime',
        ],
    },
});

// array querying
db.users.find({ 'hobbies.title': 'Cooking' });
db.users.find({ hobbies: { $size: 3 } });
db.boxoffices.find({ genre: { $all: ['action', 'thriller'] } });
db.users.find({
    hobbies: {
        $elemMatch: { title: 'Sport', frequency: { $gt: 2 } },
    },
});

//cursor
const dataCursor = db.movies.find();
dataCursor.next();
dataCursor.hasNext();
dataCursor.forEach((doc) => printjson(doc));
db.movies.find().sort({ 'rating.average': -1, runtime: -1 });
db.movies
    .find()
    .sort({ 'rating.average': -1, runtime: -1 })
    .skip(200);

db.movies
    .find()
    .sort({ 'rating.average': -1, runtime: -1 })
    .skip(100)
    .limit(10)
    .count();

// projections
db.movies.find(
    {},
    { name: 1, genres: 1, rating: 1, runtime: 1, 'schedule.time': 1 }
);
db.movies.find({ genres: 'Drama' }, { 'genres.$': 1 });
db.movies.find(
    { genres: 'Drama' },
    { genres: { $elemMatch: { $eq: 'Horror' } } }
);
db.movies
    .find(
        { 'rating.average': { $gt: 9 } },
        { genres: { $slice: [1, 3] }, name: 1 }
    )
    .limit(3);
// -------------------------------------------------------------------------------UPDATE OPERATIONS----------------------------------------------------------------------------------------------

db.users.updateOne(
    { name: 'Manuel' },
    { $inc: { age: -3 }, $set: { isSporty: false } }
);

db.users.updateOne({ name: 'Chris' }, { $min: { age: 35 } });
db.users.updateOne({ name: 'Chris' }, { $max: { age: 25 } });
db.users.updateOne({ name: 'Chris' }, { $mul: { age: 1.1 } });

// $unset
db.users.updateMany({ isSporty: true }, { $unset: { phone: 1 } });

// $rename
db.users.updateMany({}, { $rename: { age: 'totalAge' } });

// ousert option
db.users.updateOne(
    { name: 'Maria' },
    {
        $set: {
            age: 29,
            hobbies: [{ title: 'Painting', frequency: 3 }],
            isSporty: false,
        },
    },
    { upsert: true }
);

// updating matched array elements
db.users.updateMany(
    {
        hobbies: {
            $elemMatch: { title: 'Sports', frequency: { $gte: 3 } },
        },
    },
    { $set: { 'hobbies.$.highFrequency': true } }
);

// updating all array elements
db.users.updateMany(
    { totalAge: { $gt: 30 } },
    { $inc: { 'hobbies.$[].frequency': -1 } }
);

db.users.updateMany(
    { 'hobbies.frequency': { $gt: 2 } },
    { $set: { 'hobbies.$[el].normalCount': true } },
    { arrayFilters: [{ 'el.frequency': { $gt: 2 } }] }
);

// adding array elements
db.users.updateOne(
    { name: 'Maria' },
    { $push: { hobbies: { title: 'Storts', frequency: 2 } } }
);

db.users.updateOne(
    { name: 'Maria' },
    {
        $push: {
            hobbies: {
                $each: [
                    { title: 'Reading', frequency: 4 },
                    { title: 'Yoga', frequency: 5 },
                ],
            },
        },
    }
);

db.users.updateOne(
    { name: 'Maria' },
    {
        $push: {
            hobbies: {
                $each: [
                    { title: 'Chating', frequency: 4 },
                    { title: 'Games', frequency: 5 },
                ],
                $sort: { frequency: -1 },
            },
        },
    }
);

// delete one element from array
db.users.updateOne(
    { name: 'Maria' },
    { $pull: { hobbies: { title: 'Games' } } }
);

db.users.updateOne({ name: 'Chris' }, { $pop: { hobbies: 1 } });

// $addToSet
db.users.updateOne(
    { name: 'Maria' },
    { $addToSet: { hobbies: { title: 'Games' } } }
);

// -------------------------------------------------------------------------------DELETE OPERATIONS----------------------------------------------------------------------------------------------

db.users.drop();
db.users.deletOne({ name: 'Chris' });
db.users.deletMany({});
db.dropDatabase();

// -------------------------------------------------------------------------------INDEXES----------------------------------------------------------------------------------------------

db.contacts.explain().find({ 'db.age': { $gt: 60 } });
db.contacts.explain('executionStats').find({ 'db.age': { $gt: 60 } });
db.contacts.createIndex({ 'dob.age': 1 });

db.contacts.dropIndex({ 'dob.age': 1 });
db.contacts.createIndex({ 'dob.age': 1, gender: 1 });

db.contacts.getIndexes();

db.contacts.createIndex({ email: 1 }, { unique: true });

db.contacts.createIndex(
    { 'dob.age': 1 },
    { partialFilterExpression: { gender: 'mail' } }
);

db.users.createIndex(
    { email: 1 },
    {
        unique: true,
        partialFilterExpression: { email: { $exists: true } },
    }
);

db.users.createIndex(
    { email: 1 },
    {
        unique: true,
        partialFilterExpression: { email: { $exists: true } },
    }
);

db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 10 });

db.customers.explain('executionStats').find({ name: 'Max' });

db.customers
    .explain('allPlansExecution')
    .find({ name: 'Max', age: 30 });

// hobbies as an array of strings ['Cooking', 'Sports'], addresses as an array of embedded document [{street: 'Main'}, {street: 'Second'}].
// Multi-Key indexes is not working with two parallel arrays e.g. db.contacts.createIndex({ addresses: 1, hobbies: 1 });

db.contacts.createIndex({ hobbies: 1 });
db.contacts.createIndex({ addresses: 1 });
db.contacts.createIndex({ 'addresses.street': 1 });

// only one text index per collection
db.products.createIndex({ description: 'text' });
db.products.find({ $text: { $search: 'awesome' } });

db.products
    .find(
        { $text: { $search: 'awesome t-shirt' } },
        { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } });

db.products.createIndex({ title: 'text', description: 'text' });
db.products.find({ $text: { $search: 'ship' } });

db.products.find({ $text: { $search: 'awesome -t-shirt' } });
db.products.createIndex(
    { title: 'text', description: 'text' },
    {
        default_language: 'english',
        weights: { title: 1, description: 10 },
    }
);

// During index creation collection is locked till index will be created.
// If a db is large it can take couple of minutes and it's not good solution for production
// Use background option when create an index to avoid collection lock.

db.ratings.createIndex({ age: 1 }, { background: true });

// -------------------------------------------------------------------------------GEOSPATIAL DATA----------------------------------------------------------------------------------------------

db.places.insertOne({
    name: 'California Academy of Sciences',
    location: {
        type: 'Point',
        coordinates: [-122.4701339, 37.7689276],
    },
});

db.places.find({
    location: {
        $near: {
            $geometry: {
                type: 'Point',
                coordinates: [-122.477741, 37.769791],
            },
        },
    },
});

db.places.createIndex({ location: '2dsphere' });
db.places.find({
    location: {
        $near: {
            $geometry: {
                type: 'Point',
                coordinates: [-122.477741, 37.769791],
            },
            $maxDistance: 700,
            $minDistance: 10,
        },
    },
});

db.places.find({
    location: {
        $geoWithin: {
            $geometry: {
                type: 'Polygon',
                coordinates: [[p1, p2, p3, p4, p1]],
            },
        },
    },
});

db.areas.find({
    area: {
        $geoIntersects: {
            $geometry: {
                type: 'Point',
                coordinates: [-122.483262, 37.770141],
            },
        },
    },
});

db.places.find({
    location: {
        $geoWithin: {
            $centerSphere: [[-122.46203, 37.77286], 1 / 6378.1],
        },
    },
});

// -------------------------------------------------------------------------------AGGREGATION FRAMEWORK----------------------------------------------------------------------------------------------

// match stage
db.persons.aggregate([{ $match: { gender: 'female' } }]);

// group stage
db.persons.aggregate([
    { $match: { gender: 'female' } },
    {
        $group: {
            _id: { state: '$location.state' },
            totalPersons: { $sum: 1 },
        },
    },
]);

// sort

db.persons.aggregate([
    { $match: { gender: 'female' } },
    {
        $group: {
            _id: { state: '$location.state' },
            totalPersons: { $sum: 1 },
        },
    },
    { $sort: { totalPersons: -1 } },
]);

db.persons.aggregate([
    { $match: { 'dob.age': { $gt: 50 } } },
    {
        $group: {
            _id: { gender: '$gender' },
            totalPersons: { $sum: 1 },
            avarageAge: { $avg: '$dob.age' },
        },
    },
    { $sort: { totalPersons: -1 } },
]);

db.persons.aggregate([
    { $match: { 'dob.age': { $gt: 50 } } },
    {
        $group: {
            _id: { gender: '$gender' },
            totalPersons: { $sum: 1 },
            avarageAge: { $avg: '$dob.age' },
        },
    },
    { $sort: { totalPersons: -1 } },
]);

// $project

db.persons.aggregate([
    {
        $project: {
            _id: 0,
            gender: 1,
            fullName: {
                $concat: [
                    { $toUpper: '$name.title' },
                    ' ',
                    {
                        $toUpper: {
                            $substrCP: ['$name.first', 0, 1],
                        },
                    },
                    {
                        $substrCP: [
                            '$name.first',
                            1,
                            {
                                $subtract: [
                                    { $strLenCP: '$name.first' },
                                    1,
                                ],
                            },
                        ],
                    },
                    ' ',
                    { $toUpper: { $substrCP: ['$name.last', 0, 1] } },
                    {
                        $substrCP: [
                            '$name.last',
                            1,
                            {
                                $subtract: [
                                    { $strLenCP: '$name.last' },
                                    1,
                                ],
                            },
                        ],
                    },
                ],
            },
        },
    },
]);

db.persons.aggregate([
    {
        $project: {
            _id: 0,
            name: 1,
            email: 1,
            birthdate: {
                $toDate: '$dob.date',
            },
            age: '$dob.age',
            location: {
                type: 'Point',
                coordinates: [
                    {
                        $convert: {
                            input: '$location.coordinates.longitude',
                            to: 'double',
                            onError: 0.0,
                            onNull: 0.0,
                        },
                    },
                    {
                        $convert: {
                            input: '$location.coordinates.latitude',
                            to: 'double',
                            onError: 0.0,
                            onNull: 0.0,
                        },
                    },
                ],
            },
        },
    },
    {
        $project: {
            _id: 0,
            gender: 1,
            email: 1,
            location: 1,
            birthdate: 1,
            age: 1,
            fullName: {
                $concat: [
                    { $toUpper: '$name.title' },
                    ' ',
                    {
                        $toUpper: {
                            $substrCP: ['$name.first', 0, 1],
                        },
                    },
                    {
                        $substrCP: [
                            '$name.first',
                            1,
                            {
                                $subtract: [
                                    { $strLenCP: '$name.first' },
                                    1,
                                ],
                            },
                        ],
                    },
                    ' ',
                    { $toUpper: { $substrCP: ['$name.last', 0, 1] } },
                    {
                        $substrCP: [
                            '$name.last',
                            1,
                            {
                                $subtract: [
                                    { $strLenCP: '$name.last' },
                                    1,
                                ],
                            },
                        ],
                    },
                ],
            },
        },
    },
    {
        $group: {
            _id: { birthYear: { $isoWeekYear: '$birthdate' } },
            totalPersons: { $sum: 1 },
        },
    },
    { $sort: { totalPersons: -1 } },
]);

db.friends.aggregate([
    { $unwind: '$hobbies' },
    {
        $group: {
            _id: { age: '$age' },
            allHobbies: { $addToSet: '$hobbies' },
        },
    },
]);

db.friends.aggregate([
    {
        $project: {
            _id: 0,
            emaxScore: { $slice: ['$examScores', 1] },
        },
    },
]);

db.friends.aggregate([
    {
        $project: {
            _id: 0,
            emaxScore: { $slice: ['$examScores', -2] },
        },
    },
]);

db.friends.aggregate([
    {
        $project: {
            _id: 0,
            emaxScore: { $slice: ['$examScores', 2, 1] },
        },
    },
]);

db.friends.aggregate([
    {
        $project: {
            _id: 0,
            numScores: { $size: '$examScores' },
        },
    },
]);

db.friends.aggregate([
    {
        $project: {
            _id: 0,
            examScores: {
                $filter: {
                    input: '$examScores',
                    as: 'sc',
                    cond: { $gt: ['$$sc.score', 60] },
                },
            },
        },
    },
]);

db.friends.aggregate([
    { $unwind: '$examScores' },
    {
        $project: {
            _id: 1,
            name: 1,
            age: 1,
            score: '$examScores.score',
        },
    },
    {
        $group: {
            _id: '$_id',
            name: { $first: '$name' },
            maxScore: { $max: '$score' },
        },
    },
    { $sort: { maxScore: -1 } },
]);

db.persons.aggregate([
    {
        $bucket: {
            groupBy: '$dob.age',
            boundaries: [18, 30, 40, 50, 60, 120],
            output: {
                numPersons: { $sum: 1 },
                averageAge: { $avg: '$dob.age' },
            },
        },
    },
]);

db.persons.aggregate([
    {
        $bucketAuto: {
            groupBy: '$dob.age',
            buckets: 10,
            output: {
                numPersons: { $sum: 1 },
                averageAge: { $avg: '$dob.age' },
            },
        },
    },
]);

db.persons.aggregate([
    { $match: { gender: 'male' } },
    {
        $project: {
            _id: 0,
            name: { $concat: ['$name.first', ' ', '$name.last'] },
            birthdate: { $toDate: '$dob.date' },
        },
    },
    { $sort: { birthdate: 1 } },
    { $skip: 10 },
    { $limit: 10 },
]);

db.persons.aggregate([
    {
        $project: {
            _id: 0,
            name: 1,
            email: 1,
            birthdate: { $toDate: '$dob.date' },
            age: '$dob.age',
            location: {
                type: 'Point',
                coordinates: [
                    {
                        $convert: {
                            input: '$location.coordinates.longitude',
                            to: 'double',
                            onError: 0.0,
                            onNull: 0.0,
                        },
                    },
                    {
                        $convert: {
                            input: '$location.coordinates.latitude',
                            to: 'double',
                            onError: 0.0,
                            onNull: 0.0,
                        },
                    },
                ],
            },
        },
    },
    {
        $project: {
            gender: 1,
            email: 1,
            location: 1,
            birthdate: 1,
            age: 1,
            fullName: {
                $concat: [
                    {
                        $toUpper: {
                            $substrCP: ['$name.first', 0, 1],
                        },
                    },
                    {
                        $substrCP: [
                            '$name.first',
                            1,
                            {
                                $subtract: [
                                    { $strLenCP: '$name.first' },
                                    1,
                                ],
                            },
                        ],
                    },
                    ' ',
                    {
                        $toUpper: {
                            $substrCP: ['$name.last', 0, 1],
                        },
                    },
                    {
                        $substrCP: [
                            '$name.last',
                            1,
                            {
                                $subtract: [
                                    { $strLenCP: '$name.last' },
                                    1,
                                ],
                            },
                        ],
                    },
                ],
            },
        },
    },
    { $out: 'transformedPersons' },
]);

db.transformedPersons.aggregate([
    {
        $geoNear: {
            near: { type: 'Point', coordinates: [-18.4, -42.8] },
            maxDistance: 1000000,
            $limit: 10,
            query: { age: { $gt: 30 } },
            distanceField: 'distance'
        },
    },
]);
