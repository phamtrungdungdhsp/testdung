"use strict";

const promise = require('bluebird');
const objectId = require('mongoose').Types.ObjectId;
const mailUser = require('../mailer/module/mail_user');
const stringUtils = require('../utils/string_utils');
const utils = require('../utils/utils');
const fileUtils = require('../utils/file_utils');
const timeUtils = require('../utils/time_utils');
const APP = require('../../app');

const BaseModel = require('./intalize/base_model');

class Model extends BaseModel {

    constructor() {
        super(require('../database/users-col'))
    }

    example() {
        const that = this;
        return new promise(async resolve => {
            let user = await that.getDataWhere({}, that.FIND_ONE());
            return resolve({error: false, user});
        })
    }

}

exports.MODEL = new Model();