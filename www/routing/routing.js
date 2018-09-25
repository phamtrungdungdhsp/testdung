"use strict";

const authorization = require('./authorization');
const crossCf = require('../config/cf_cross');

const routing = {
    mainHandel: function (app, io) {
        if (crossCf.openCross) {
            let cors = require('cors');
            app.use(cors());
            app.use(function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
                res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

                res.setHeader('Access-Control-Allow-Credentials', true);
                next();
            });

            let crossdomain = require('crossdomain');
            crossdomain({domain: '*'});
        }

        app.all('/crossdomain.xml', function (req, res, next) {
            res.set('Content-Type', 'application/xml; charset=utf-8');
            res.send(xml, 200);
        });

        app.use(authorization.checkAuthorization);

        authorization.initAuths.forEach(function (itemAuth, index) {
            app.use(new itemAuth().basePath, new itemAuth().exportModule(io));
        });

        app.get("/page-404.html", function (req, res) {
            routing.pageNotFound(req, res);
        });


        app.post("/404.html", function (req, res) {
            routing.pageNotFound(req, res);
        });

        app.use("*", function (req, res) {
            routing.pageNotFound(req, res);
        });


    },

    pageNotFoundView: function (res) {
        return res.render("public/pages/page-404.ejs");
    },

    pageNotFoundJson: function (res) {
        return res.json({error: true, message: "Page not found!"});
    },
    pageNotFound: function (req, res) {
        if (req.method == "POST") {
            routing.pageNotFoundJson(res);
        } else {
            routing.pageNotFoundView(res);
        }
    }
};

module.exports = routing;