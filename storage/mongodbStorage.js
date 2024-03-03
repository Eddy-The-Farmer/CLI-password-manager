import { MongoClient } from 'mongodb';
import Storage from './Storage';

/**
 * MongoDB storage class implementing the Storage interface.
 * Stores passwords in a MongoDB database.
 */
class MongoDBStorage extends Storage {
    /**
     * Constructs a new MongoDBStorage instance.
     * @param {string} connectionString - The MongoDB connection string.
     * @param {string} dbName - The name of the MongoDB database.
     * @param {string} collectionName - The name of the MongoDB collection.
     */
    constructor(connectionString, dbName, collectionName) {
        super();
        this.connectionString = connectionString;
        this.dbName = dbName;
        this.collectionName = collectionName;
    }

    /**
     * Saves passwords to the MongoDB collection.
     * @param {Array<Object>} passwords - An array of password objects to be saved.
     * @returns {Promise<void>} A Promise that resolves when the passwords are saved successfully.
     */
    async savePasswords(passwords) {
        const client = new MongoClient(this.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
            await client.connect();
            const db = client.db(this.dbName);
            const collection = db.collection(this.collectionName);
            await collection.updateOne({}, { $set: { passwords } }, { upsert: true });
        } finally {
            await client.close();
        }
    }

    /**
     * Loads passwords from the MongoDB collection.
     * @returns {Promise<Array<Object>>} A Promise that resolves with an array of password objects loaded from the MongoDB collection.
     */
    async loadPasswords() {
        const client = new MongoClient(this.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
            await client.connect();
            const db = client.db(this.dbName);
            const collection = db.collection(this.collectionName);
            const result = await collection.findOne({});
            return result ? result.passwords : [];
        } finally {
            await client.close();
        }
    }

    /**
     * Retrieves a password by its name from the MongoDB collection.
     * @param {string} name - The name of the account.
     * @returns {Promise<Object|null>} A Promise that resolves with the password object if found, or null if not found.
     */
    async getPassword(name) {
        const client = new MongoClient(this.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
            await client.connect();
            const db = client.db(this.dbName);
            const collection = db.collection(this.collectionName);
            const result = await collection.findOne({ 'passwords.name': name });
            if (result) {
                const password = result.passwords.find(password => password.name === name);
                return password || null;
            }
            return null;
        } finally {
            await client.close();
        }
    }

    /**
     * Deletes a password by its name from the MongoDB collection.
     * @param {string} name - The name of the account.
     * @returns {Promise<void>} A Promise that resolves when the password is deleted successfully.
     */
    async deletePassword(name) {
        const client = new MongoClient(this.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
            await client.connect();
            const db = client.db(this.dbName);
            const collection = db.collection(this.collectionName);
            await collection.updateOne({}, { $pull: { passwords: { name } } });
        } finally {
            await client.close();
        }
    }
}

export default MongoDBStorage;