/**
 * Abstract storage class defining the interface for storing and retrieving passwords.
 */
class Storage {
    /**
     * Saves passwords to the storage.
     * @param {Array<Object>} passwords - An array of password objects to be saved.
     * @returns {Promise<void>} A Promise that resolves when the passwords are saved successfully.
     */
    async savePasswords(passwords) {
        throw new Error('Method not implemented');
    }

    /**
     * Loads passwords from the storage.
     * @returns {Promise<Array<Object>>} A Promise that resolves with an array of password objects loaded from the storage.
     */
    async loadPasswords() {
        throw new Error('Method not implemented');
    }

    /**
     * Retrieves a password by its name from the storage.
     * @param {string} name - The name of the account.
     * @returns {Promise<Object|null>} A Promise that resolves with the password object if found, or null if not found.
     */
    async getPassword(name) {
        throw new Error('Method not implemented');
    }

    /**
     * Deletes a password by its name from the storage.
     * @param {string} name - The name of the account.
     * @returns {Promise<void>} A Promise that resolves when the password is deleted successfully.
     */
    async deletePassword(name) {
        throw new Error('Method not implemented');
    }
}

export default Storage;
