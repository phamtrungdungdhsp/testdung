"use strict";

const langSession = new (require('./intalize/session'))('user-session');

module.exports = {
    saveUser(session, user) {
        langSession.saveSession(session, user);
    },
    isLogin(session){
        if(langSession.getSession(session)){
            return true;
        }else{
            return false;
        }
    },
    getUser(session) {
        return langSession.getSession(session);
    }
};