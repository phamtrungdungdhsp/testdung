"use strict";

let express = require('express'),
    cluster = require('cluster'),
    net = require('net'),
    sio = require('socket.io'),
    sio_redis = require('socket.io-redis'),
    https = require('https'),
    farmhash = require('farmhash'),
    cors = require("cors"),
    fs = require('fs');
const redis = require('redis');
var client = redis.createClient();



const httpsConfig = require('./www/config/cf_https');
let num_processes = require('os').cpus().length;
let hostConf = require('./www/config/cf_host');
let stringUtils = require('./www/utils/string_utils');



exports.BASE_DIR = __dirname;
exports.EXPRESS = express;

let i;
if (cluster.isMaster) {
    let workers = [];
    let spawn = function (i) {
        i = Number(i);
        workers[i] = cluster.fork();
        workers[i].on('exit', function (code, signal) {
            spawn(i);
        });
    };

    for (i = 0; i < num_processes; i++) {
        spawn(i);
    }

    let worker_index = function (ip, len) {
        return farmhash.fingerprint32(stringUtils.listCharacter()[i]) % Number(len); // Farmhash is the fastest and works with IPv6, too
    };

    net.createServer({pauseOnConnect: true}, function (connection) {
        var worker = workers[worker_index(connection.remoteAddress, num_processes)];
        worker.send('sticky-session:connection', connection);
    }).listen(hostConf.post, hostConf.host);

} else {
    let server;
    let app = new express();
    app.use(cors({
        exposedHeaders: ['Location'],
    }));
   

    var allowCrossDomain = function (req, res, next) {
        res.header('Access-Control-Allow-Origin', 'example.com');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        next();
    };

    app.use(allowCrossDomain);

    if (httpsConfig.status) {
        app.use(function (req, res, next) {
            if (!/https/.test(req.protocol)) {
                res.redirect("https://" + req.headers.host + req.url);
            } else {
                return next();
            }
        });

        const options = {
            key: fs.readFileSync(__dirname + httpsConfig.key),
            cert: fs.readFileSync(__dirname + httpsConfig.cert),
            ca: fs.readFileSync(__dirname + httpsConfig.ca),
        };
        https.createServer(options, app).listen(443);
        server = app.listen(0, hostConf.host);
    } else {
        server = app.listen(0, hostConf.host);
    }
    let io = sio(server);

    io.adapter(sio_redis({host: 'localhost', port: 6379}));

    let socket = require('./www/socket/socket');
    socket(io);

    process.on('message', function (message, connection) {
        if (message !== 'sticky-session:connection') {
            return;
        }

        server.emit('connection', connection);
        connection.resume();
    });

    let config = require('./www/config/config');
    config(app, io);

    let routing = require('./www/routing/routing');
    routing.mainHandel(app, io);

    let localsRouting = require('./www/locals/locals_routing');
    localsRouting(app);
}

client.on("error", function (err) {
    console.log("Error " + err);
});
client.on('connect', function(){
    console.log("Redis client contected");
})
