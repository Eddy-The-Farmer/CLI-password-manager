# CLI-password-manager
The Password Manager is a Node.js module that allows you to securely manage passwords from the command line interface (CLI). It provides functionalities to add, retrieve, delete, and list passwords for various accounts.

## Features
- Add passwords for different accounts.
- Retrieve passwords for specific accounts.
- Delete passwords for accounts.
- List all stored account names.

## Installation
To use the Password Manager, you need to have Node.js and npm installed on your system. You can install the package via npm:
```
npm install password-manager
```

## Usage
1 - Require the package in your Node.js application:
```javascript
import PasswordManager from 'password-manager';
```

2 - Set up storage:
Choose the type of storage you want to use. The package currently supports the following storage options: LocalFileStorage (JSON file), MongoDBStorage (MongoDB database) and SQL storage.
- for example, to use LocalFileStorage:

```javascript
import LocalFileStorage from 'password-manager/storage/local-file-storage';
const storage = new LocalFileStorage('passwords.json');
```

- for example, to use MongoDBStorage:

```javascript
import MongoDBStorage from 'password-manager/storage/mongodb-storage';
const connectionString = 'mongodb://localhost:27017';
const dbName = 'myDatabase';
const collectionName = 'passwords';
const storage = new MongoDBStorage(connectionString, dbName, collectionName);
```

- for example, to use SQL storage:

```javascript
import SQLStorage from 'password-manager/storage/sql-storage';
const connectionString = 'mysql://localhost:3306';
const dbName = 'myDatabase';
const tableName = 'passwords';
const storage = new SQLStorage(connectionString, dbName, tableName);
```

3 - Create an instance of PasswordManager
```javascript
const passwordManager = new PasswordManager(storage);
```

4 - Use the PasswordManager instance to add, retrieve, delete, and list passwords:

- Add a password:
```javascript
passwordManager.addPassword('example_name', 'example_password');
``` 

- Retrieve a password:
```javascript
const password = passwordManager.getPassword('example_name');
```

- Delete a password:
```javascript
passwordManager.deletePassword('example_name');
```

- List all passwords:
```javascript
passwordManager.listPasswords();
```

5 - Handle errors:
Make sure to handle errors appropriately when using password manager methods. Errors might occur due to network issues, storage problems, or validation errors.

## Configuration
The Password Manager can be configured to use different storage options. You can also configure the storage options to use different databases, tables, or collections.

## Contributing
Contributions are welcome! Please see the CONTRIBUTING.md file for more information.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.