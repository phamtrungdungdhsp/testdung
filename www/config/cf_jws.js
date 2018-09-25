"use strict";

const databaseConfig = require('./cf_database');

let mongodUrl = `${databaseConfig._mongod_user === '' ? 'mongodb://' + databaseConfig._mongodb_host + ':' + databaseConfig._mongodb_port + '/' + databaseConfig._mongod_name :
    'mongodb://' + databaseConfig._mongod_user + ':' + databaseConfig._mongodb_pass + '@' + databaseConfig._mongodb_host + ':' + databaseConfig._mongodb_port + '/' + databaseConfig._mongod_name}`;


module.exports = {
    secret: 'stravel-codelab-45dsjahd66#%$^&%',
    url: mongodUrl
};