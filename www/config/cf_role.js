"use strict";
const utils = require('../utils/utils');
const userSession = require('../session/user-session');
const childRouter = require('../routing/child_routing');

module.exports = {
    role: {
        all: {
            bin: 1,
            auth: function (req, res, next) {
                if(userSession.isLogin(req.session) === true){
                    childRouter.redirect(res, '/dashboard');
                    
                }else{
                    next();
                }
            }
        },

        admin: {
            bin: 2,
            auth: async function (req, res, next) {
                if(userSession.isLogin(req.session) === true){
                    next();
                }else{
                    childRouter.redirect(res, '/login');
                }
                
            }
        },

        noaccount: {
            bin: 3,
            auth: async function (req, res, next) {
                next();
            }
        },
    },

    authorization: function (req, res, next) {
        let hasRole = false;
        let currentRole = null;
        for (let itemRole in this.role) {
            if (!hasRole) {
                if (res.bindingRole.config.auth.includes(this.role[itemRole].bin)) {
                    hasRole = true;
                    currentRole = this.role[itemRole];
                }
            }
        }

        currentRole.auth(req, res, next);
    }
};