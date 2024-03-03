const inquirer = require('inquirer');
import LocalFileStorage from './Storage/localFileStorage';
import MongoDBStorage from '../storage/mongodbStorage';
import SQLStorage from '../storage/sqlStorage';
import PasswordManager from './password-manager';

class PasswordManager {
    /**
     * Constructs a new PasswordManager instance.
     * @param {Storage} storage - The storage instance to use for storing passwords.
     */
    constructor(storage) {
        this.storage = storage;
    }

    /**
     * Prompts the user to choose an action and performs the chosen action.
     * @returns {Promise<void>} A Promise that resolves when the action is completed.
     */
    async promptAction() {
        const { action } = await inquirer.prompt({
            type: 'list',
            name: 'action',
            message: 'Choose an action:',
            choices: ['Add Password', 'Get Password', 'Delete Password', 'List Passwords', 'Exit']
        });

        switch (action) {
            case 'Add Password':
                await this.addPassword();
                break;
            case 'Get Password':
                await this.getPassword();
                break;
            case 'Delete Password':
                await this.deletePassword();
                break;
            case 'List Passwords':
                await this.listPasswords();
                break;
            case 'Exit':
                console.log('Goodbye!');
                process.exit();
        }
    }

    /**
     * Prompts the user to enter an account name and password, then saves them.
     * @returns {Promise<void>} A Promise that resolves when the password is added successfully.
     */
    async addPassword() {
        const { accountName, password } = await inquirer.prompt([
            { type: 'input', name: 'accountName', message: 'Enter account name:' },
            { type: 'password', name: 'password', message: 'Enter password:' }
        ]);

        const passwords = await this.storage.loadPasswords();
        passwords.push({ name: accountName, password });
        await this.storage.savePasswords(passwords);

        console.log('Password added successfully.');
        await this.promptAction();
    }

    /**
     * Prompts the user to enter an account name and retrieves the corresponding password.
     * @returns {Promise<void>} A Promise that resolves when the password is retrieved successfully.
     */
    async getPassword() {
        const { accountName } = await inquirer.prompt({ type: 'input', name: 'accountName', message: 'Enter account name:' });
        const passwordObj = await this.storage.getPassword(accountName);

        if (passwordObj) {
            console.log(`Password for ${accountName}: ${passwordObj.password}`);
        } else {
            console.log(`Password for ${accountName} not found.`);
        }

        await this.promptAction();
    }

    /**
     * Prompts the user to enter an account name and deletes the corresponding password.
     * @returns {Promise<void>} A Promise that resolves when the password is deleted successfully.
     */
    async deletePassword() {
        const { accountName } = await inquirer.prompt({ type: 'input', name: 'accountName', message: 'Enter account name:' });

        const passwords = await this.storage.loadPasswords();
        const index = passwords.findIndex(password => password.name === accountName);

        if (index !== -1) {
            passwords.splice(index, 1);
            await this.storage.savePasswords(passwords);
            console.log(`Password for ${accountName} deleted successfully.`);
        } else {
            console.log(`Password for ${accountName} not found.`);
        }

        await this.promptAction();
    }

    /**
     * Lists all stored account names.
     * @returns {Promise<void>} A Promise that resolves when the account names are listed successfully.
     */
    async listPasswords() {
        const passwords = await this.storage.loadPasswords();

        if (passwords.length === 0) {
            console.log('No passwords stored.');
        } else {
            console.log('Stored account names:');
            passwords.forEach(password => console.log(password.name));
        }

        await this.promptAction();
    }
}

// Uncomment one of the following lines to use a specific storage implementation
// const storage = new LocalFileStorage('passwords.json');
// const storage = new MongoDBStorage(connectionString, dbName, collectionName);
// const storage = new SQLStorage(connectionString, tableName);

const passwordManager = new PasswordManager(storage);
passwordManager.promptAction().catch(error => console.error('Error:', error));
