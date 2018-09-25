"use strict";

const promise = require('bluebird');
const objectId = require('mongoose').Types.ObjectId;
// const mailUser = require('../mailer/module/mail_user');
const stringUtils = require('../utils/string_utils');
const utils = require('../utils/utils');
const fileUtils = require('../utils/file_utils');
const timeUtils = require('../utils/time_utils');
const APP = require('../../app');
var bcrypt = require('bcrypt-nodejs');

const BaseModel = require('./intalize/base_model');

class modelUser extends BaseModel {

    constructor() {
        super(require('../database/tbUser'))
    }

    login(data){
        const that = this;
        return new promise(async resolve =>{
            let user = await that.getDataWhere({email: data.email}, that.FIND_ONE())
            .then(function(user){
               if(!user) {
                   return resolve({msg: 'wrongemail', user: null});
                }else{
                    if(bcrypt.compareSync(data.password, user.password) === true){
                            if(user.status === true){
                                if(user.isActive === true){
                                    return resolve({msg: 'success', user:user});
                                }else{
                                    return resolve({msg: 'unactive',user: null});
                                }
                            }else{
                                return resolve({msg: 'ban',user: null});
                            }
                    }else{
                        return resolve({msg: 'wrongpass',user: null});
                    }
                }
            });
        });
    };
    updateUsername(id, username) {
        const that = this;
        return new promise(async resolve => {
            let user = await that.updateById(id, username);
            let user2 = await that.getDataById(id);
            return resolve(user2);
        })
    };
    updatePassword(id,password){
        const that = this;
        return new promise(async resolve =>{
           await that.getDataById(id).then(function(oldpass){
                if(bcrypt.compareSync(password.oldpass, oldpass.password) === true){
                    if(password.newpass === password.repass){
                        let newpass = {password: bcrypt.hashSync(password.newpass, bcrypt.genSaltSync(8), null)};
                        return that.updateById(id, newpass).then(function(){
                            return resolve({msg: 'success'});
                        });
                    }else{
                        return resolve({msg: 'newpwnm'});
                    }
                }else{
                    return resolve({msg: 'oldpwnm'});
                }
            });

        });
    }

}

exports.MODEL = new modelUser();