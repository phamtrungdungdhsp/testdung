"use strict";

const roles = require('../../config/cf_role');
const ChildRouter = require('../child_routing');
const session = require('../../session/user-session');

var tbuser_model = require('../../models/tbuser_model');







module.exports = class Auth extends ChildRouter {


    constructor() {
        super('/');
    }
    

    registerRouting(io) {
        return {
            '/': {
                config: {
                    auth: [roles.role.all.bin],
                    title: 'Trang chủ',
                    type: 'view',
                },
                methods: {
                    get: [function (req, res) {
                        return ChildRouter.redirect(res, '/login');
                    }]
                },
            },
            '/logout': {
                config: {
                    auth: [roles.role.all.bin],
                    title: 'Signout',
                    type: 'view',
                },
                methods: {
                    get: [function (req, res) {
                        req.session.destroy();
                        return ChildRouter.redirect(res, '/login');
                    }]
                },
            },


            '/login': {
                config: {
                    auth: [roles.role.all.bin],
                    view: 'public/pages/login.ejs',
                    title: 'Đăng nhập',
                    type: 'view',
                },
                methods: {
                    get: [function (req, res) {
                        ChildRouter.renderToView(req, res);
                    }],

                    post: [async function (req, res,next) {
                       var data = req.body;
                       return tbuser_model.MODEL.login(data).then(function(data){
                        if(data.msg === 'success'){
                            session.saveUser(req.session, data.user);
                        }
                         return res.send(data.msg);
                       })

                    }]
                }
            },
           

            '/dashboard': {
                config: {
                    auth: [roles.role.admin.bin],
                    view: 'public/pages/dashboard.ejs',
                    title: 'Trang chủ',
                    type: 'view',
                }, 
                methods:{
                    get: [function (req, res) {
                       return ChildRouter.renderToPath(req,res, 'public/pages/dashboard.ejs')
                    }]
                },
            },
            '/editusername/:id':{
                config: {
                    auth: [roles.role.admin.bin],
                }, 
                methods:{
                    post: [ async function (req, res) {
                       var _id = req.params.id;
                       var data = req.body;
                        return tbuser_model.MODEL.updateUsername(_id, {username: data.username})
                        .then(function(data){
                            session.saveUser(req.session, data);
                            return res.send(data);
                        });
                    }]
                },
                
            },
            '/updatepassword/:id':{
                config: {
                    auth: [roles.role.admin.bin],
                }, 
                methods:{
                    post: [ async function (req, res) {
                       var _id = req.params.id;
                       var data = req.body;
                        return tbuser_model.MODEL.updatePassword(_id, data)
                        .then(function(msg){
                           return res.send(msg);
                        })
                        
                    }]
                },
                
            },     
        }
    }
};
