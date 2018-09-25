"use strict";
let express = require('express');
let url = require('url');
let UserSession = require('../session/user-session');

class ChildRouter {

    constructor(basePath) {
        this.basePath = basePath;
        this.registerRouting;
    }

    registerRouting(io) {

    }

    exportModule(io) {
        let router = express.Router();

        for (var basePath in this.registerRouting(io)) {
            var item = this.registerRouting(io)[basePath];

            if (typeof item.methods.post !== 'undefined' && item.methods.post !== null) {
                if (item.methods.post.length === 1) {
                    router.post(basePath, item.methods.post[0]);
                } else if (item.methods.post.length === 2) {
                    router.post(basePath, item.methods.post[0], item.methods.post[1]);
                }
            }

            if (typeof item.methods.get !== 'undefined' && item.methods.get !== null) {
                if (item.methods.get.length === 1) {
                    router.get(basePath, item.methods.get[0]);
                } else if (item.methods.get.length === 2) {
                    router.get(basePath, item.methods.get[0], item.methods.get[1]);
                }
            }
        }

        return router;
    }

    static responseError(msg, res, data) {
        return res.json({error: true, message: msg, data: data});
    }

    static response(res, data) {
        return res.json(data);
    }


    static responseSuccess(msg, res, data) {
        return res.json({error: false, message: msg, data: data});
    }

    static pageNotFoundJson(res) {
        return res.json({"Error": "Page not found!"});
    }

    static renderToView(req, res, data, title) {
        if (!data) {
            data = {};
        }

        if (title) {
            res.bindingRole.config.title = title;
        }
        data.render = res.bindingRole.config;
        data.url = url.format({
            protocol: req.protocol,
            host: req.get('host'),
            pathname: req.originalUrl
        });

        data.baseUrl = url.format({
            protocol: req.protocol,
            host: req.get('host'),
        });


        return res.render(res.bindingRole.config.view, data);

    }

    static renderToPath(req, res, path, data, title) {
        data = typeof data === 'undefined' || data === null ? {} : data;
        if (title) {
            res.bindingRole.config.title = title;
        }

        data.render = res.bindingRole.config;

        data.language = res.language;
        data.languageName = res.languageName;
        data.languageKey = res.languageKey;
        if (res.country) {
            data.countryName = res.country.NativeName;
            data.countryKey = res.country.Alpha2Code;
        }


        data.isLogin = UserSession.isLogin(req.session);
        data.userLogin = UserSession.getUser(req.session);
        return res.render(path, {data:data});
    }

    static redirect(res, path) {
        return res.redirect(path);
    }
}

module.exports = ChildRouter;