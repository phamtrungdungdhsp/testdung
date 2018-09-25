"use strict";

const mainApp = require('../../app');

module.exports = function (app) {
    app.use('/template/', mainApp.EXPRESS.static(mainApp.BASE_DIR + '/template/'));
    app.use('/views/', mainApp.EXPRESS.static(mainApp.BASE_DIR + '/views/'));
    app.use('/files/', mainApp.EXPRESS.static(mainApp.BASE_DIR + '/files/'));
};