import inquirer from 'inquirer';
import LocalFileStorage from './storage/localFileStorage.js';
import PasswordManager from './password-manager/password-manager.js';

async function main() {
    // Create a storage instance (e.g., LocalFileStorage)
    const storage = new LocalFileStorage('passwords.json');

    // Create a password manager instance with the chosen storage
    const passwordManager = new PasswordManager(storage);

    while (true) {
        const { action } = await inquirer.prompt({
            type: 'list',
            name: 'action',
            message: 'Choose an action:',
            choices: ['Add Password', 'Get Password', 'Delete Password', 'List Passwords', 'Exit']
        });

        switch (action) {
            case 'Add Password':
                await addPassword(passwordManager);
                break;
            case 'Get Password':
                await getPassword(passwordManager);
                break;
            case 'Delete Password':
                await deletePassword(passwordManager);
                break;
            case 'List Passwords':
                await listPasswords(passwordManager);
                break;
            case 'Exit':
                console.log('Goodbye!');
                process.exit();
        }
    }
}

async function addPassword(passwordManager) {
    const { accountName, password } = await inquirer.prompt([
        { type: 'input', name: 'accountName', message: 'Enter account name:' },
        { type: 'password', name: 'password', message: 'Enter password:' }
    ]);

    try {
        await passwordManager.addPassword(accountName, password);
        console.log('Password added successfully.');
    } catch (error) {
        console.error('Error adding password:', error.message);
    }
}

async function getPassword(passwordManager) {
    const { accountName } = await inquirer.prompt({ type: 'input', name: 'accountName', message: 'Enter account name:' });
    try {
        const password = await passwordManager.getPassword(accountName);
        if (password) {
            console.log(`Password for ${accountName}: ${password}`);
        } else {
            console.log(`Password for ${accountName} not found.`);
        }
    } catch (error) {
        console.error('Error getting password:', error.message);
    }
}

async function deletePassword(passwordManager) {
    const { accountName } = await inquirer.prompt({ type: 'input', name: 'accountName', message: 'Enter account name:' });
    try {
        await passwordManager.deletePassword(accountName);
        console.log(`Password for ${accountName} deleted successfully.`);
    } catch (error) {
        console.error('Error deleting password:', error.message);
    }
}

async function listPasswords(passwordManager) {
    try {
        const passwords = await passwordManager.listPasswords();
        if (passwords.length === 0) {
            console.log('No passwords stored.');
        } else {
            console.log('Stored account names:');
            passwords.forEach(name => console.log(name));
        }
    } catch (error) {
        console.error('Error listing passwords:', error.message);
    }
}

main().catch(error => console.error('Error:', error));
