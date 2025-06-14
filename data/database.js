const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');

let database;

const initDb = async () => {
    if (database) {
        console.log('Database already initialized');
        return database;
    }

    try {
        const client = await MongoClient.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        database = client.db();  // Get the DB instance
        console.log("Database connected.");
        return database;
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw err;
    }
};

// Just return the database object instead of db() function
const getDatabase = () => {
    if (!database) {
        throw new Error('Database not initialized');
    }
    return database;
};

module.exports = {
    initDb,
    getDatabase,
};
