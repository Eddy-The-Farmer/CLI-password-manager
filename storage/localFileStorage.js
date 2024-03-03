import fs from 'fs/promises';
import exp from 'constants';
import Storage from './Storage.js';

/**
 * Local file storage class implementing the Storage interface.
 * Stores passwords in a local JSON file.
 */
class LocalFileStorage extends Storage {
    /**
     * Constructs a new LocalFileStorage instance.
     * @param {string} filePath - The path to the local JSON file.
     */
    constructor(filePath) {
        super();
        this.filePath = filePath;
    }

    /**
     * Saves passwords to the local JSON file.
     * @param {Array<Object>} passwords - An array of password objects to be saved.
     * @returns {Promise<void>} A Promise that resolves when the passwords are saved successfully.
     */
    async savePasswords(passwords) {
        await fs.writeFile(this.filePath, JSON.stringify(passwords, null, 2));
    }

    /**
     * Loads passwords from the local JSON file.
     * @returns {Promise<Array<Object>>} A Promise that resolves with an array of password objects loaded from the local file.
     */
    async loadPasswords() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            // If the file doesn't exist or cannot be read, return an empty array
            return [];
        }
    }

    /**
     * Retrieves a password by its name from the local JSON file.
     * @param {string} name - The name of the account.
     * @returns {Promise<Object|null>} A Promise that resolves with the password object if found, or null if not found.
     */
    async getPassword(name) {
        const passwords = await this.loadPasswords();
        return passwords.find(password => password.name === name) || null;
    }

    /**
     * Deletes a password by its name from the local JSON file.
     * @param {string} name - The name of the account.
     * @returns {Promise<void>} A Promise that resolves when the password is deleted successfully.
     */
    async deletePassword(name) {
        let passwords = await this.loadPasswords();
        passwords = passwords.filter(password => password.name !== name);
        await this.savePasswords(passwords);
    }
}

export default LocalFileStorage;