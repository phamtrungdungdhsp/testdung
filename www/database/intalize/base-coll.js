"use strict";

var DATABASE = require('./db_connect');
var Schema = require('mongoose').Schema;
var random = require('mongoose-simple-random');
var bcrypt = require('bcrypt-nodejs');

module.exports = function (dbName, dbOb) {
    dbOb.createAt = Number;
    dbOb.updateAt = Number;
    let s = new Schema(dbOb);
    if(dbName === 'tbUser'){
        s.methods.generateHash = function(password){
            return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
        };
        s.methods.verifyPassword = function(password){
            return bcrypt.compareSync(password, this.password);
        }
    }
    s.plugin(random);

    return DATABASE.model(dbName, s);
};