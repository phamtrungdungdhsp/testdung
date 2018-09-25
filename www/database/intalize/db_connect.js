"use strict";

let mongoose = require('mongoose');
const databaseConfig = require('../../config/cf_database');
const cfMode = require('../../config/cf_mode');

let mongodUrl = "";
if (cfMode.database_product) {
    mongodUrl = `${databaseConfig.product._mongod_user === '' ? 'mongodb://' + databaseConfig.product._mongodb_host + ':' + databaseConfig.product._mongodb_port + '/' + databaseConfig.product._mongod_name :
        'mongodb://' + databaseConfig.product._mongod_user + ':' + databaseConfig.product._mongodb_pass + '@' + databaseConfig.product._mongodb_host + ':' + databaseConfig.product._mongodb_port + '/' + databaseConfig.product._mongod_name}`;
} else {
    mongodUrl = `${databaseConfig.dev._mongod_user === '' ? 'mongodb://' + databaseConfig.dev._mongodb_host + ':' + databaseConfig.dev._mongodb_port + '/' + databaseConfig.dev._mongod_name :
        'mongodb://' + databaseConfig.dev._mongod_user + ':' + databaseConfig.dev._mongodb_pass + '@' + databaseConfig.dev._mongodb_host + ':' + databaseConfig.dev._mongodb_port + '/' + databaseConfig.dev._mongod_name}`;
}

mongoose = mongoose.createConnection(mongodUrl);


module.exports = mongoose;