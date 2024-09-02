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
