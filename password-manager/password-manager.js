/**
 * PasswordManager class for managing passwords.
 */
class PasswordManager {
    /**
     * Constructs a new PasswordManager instance.
     * @param {Storage} storage - The storage instance to use for storing passwords.
     */
    constructor(storage) {
        this.storage = storage;
    }

    /**
     * Adds a new password to the storage.
     * @param {string} accountName - The name of the account.
     * @param {string} password - The password for the account.
     * @returns {Promise<void>} A Promise that resolves when the password is added successfully.
     */
    async addPassword(accountName, password) {
        // Check if the account name already exists
        const existingPasswords = await this.storage.loadPasswords();
        const existingAccount = existingPasswords.find(account => account.name === accountName);
        if (existingAccount) {
            throw new Error(`An account with the name "${accountName}" already exists.`);
        }

        // If the account name doesn't exist, add the new account
        const newPasswords = [...existingPasswords, { name: accountName, password }];
        await this.storage.savePasswords(newPasswords);
    }

    /**
     * Retrieves the password for a given account name from the storage.
     * @param {string} accountName - The name of the account.
     * @returns {Promise<string|null>} A Promise that resolves with the password if found, or null if not found.
     */
    async getPassword(accountName) {
        const passwordObj = await this.storage.getPassword(accountName);
        return passwordObj ? passwordObj.password : null;
    }

    /**
     * Deletes the password for a given account name from the storage.
     * @param {string} accountName - The name of the account.
     * @returns {Promise<void>} A Promise that resolves when the password is deleted successfully.
     */
    async deletePassword(accountName) {
        const passwords = await this.storage.loadPasswords();
        const index = passwords.findIndex(password => password.name === accountName);
        if (index !== -1) {
            passwords.splice(index, 1);
            await this.storage.savePasswords(passwords);
        }
    }

    /**
     * Lists all stored account names.
     * @returns {Promise<string[]>} A Promise that resolves with an array of account names.
     */
    async listPasswords() {
        const passwords = await this.storage.loadPasswords();
        return passwords.map(password => password.name);
    }
}

export default PasswordManager;
