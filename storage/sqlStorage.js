import { Pool } from 'pg';
import Storage from './Storage.js';

/**
 * SQL storage class implementing the Storage interface.
 * Stores passwords in a PostgreSQL database.
 */
class SQLStorage extends Storage {
    /**
     * Constructs a new SQLStorage instance.
     * @param {string} connectionString - The connection string for the PostgreSQL database.
     * @param {string} tableName - The name of the table in which passwords will be stored.
     */
    constructor(connectionString, tableName) {
        super();
        this.pool = new Pool({ connectionString });
        this.tableName = tableName;
    }

    /**
     * Saves passwords to the SQL database.
     * @param {Array<Object>} passwords - An array of password objects to be saved.
     * @returns {Promise<void>} A Promise that resolves when the passwords are saved successfully.
     */
    async savePasswords(passwords) {
        const client = await this.pool.connect();
        try {
            await client.query(`CREATE TABLE IF NOT EXISTS ${this.tableName} (name TEXT PRIMARY KEY, password TEXT)`);
            const insertQueries = passwords.map(password => {
                return client.query(`INSERT INTO ${this.tableName} (name, password) VALUES ($1, $2) ON CONFLICT (name) DO UPDATE SET password = EXCLUDED.password`, [password.name, password.password]);
            });
            await Promise.all(insertQueries);
        } finally {
            client.release();
        }
    }

    /**
     * Loads passwords from the SQL database.
     * @returns {Promise<Array<Object>>} A Promise that resolves with an array of password objects loaded from the SQL database.
     */
    async loadPasswords() {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`SELECT * FROM ${this.tableName}`);
            return result.rows.map(row => ({ name: row.name, password: row.password }));
        } finally {
            client.release();
        }
    }

    /**
     * Retrieves a password by its name from the SQL database.
     * @param {string} name - The name of the account.
     * @returns {Promise<Object|null>} A Promise that resolves with the password object if found, or null if not found.
     */
    async getPassword(name) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`SELECT * FROM ${this.tableName} WHERE name = $1`, [name]);
            if (result.rows.length > 0) {
                const { name, password } = result.rows[0];
                return { name, password };
            }
            return null;
        } finally {
            client.release();
        }
    }

    /**
     * Deletes a password by its name from the SQL database.
     * @param {string} name - The name of the account.
     * @returns {Promise<void>} A Promise that resolves when the password is deleted successfully.
     */
    async deletePassword(name) {
        const client = await this.pool.connect();
        try {
            await client.query(`DELETE FROM ${this.tableName} WHERE name = $1`, [name]);
        } finally {
            client.release();
        }
    }
}

export default SQLStorage;