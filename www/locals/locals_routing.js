"use strict";

const timeHelper = require('./module/time_helpers');
const numberHelper = require('./module/number_helpers');
const string = require('./module/string');

module.exports = function (app) {
    timeHelper(app);
    numberHelper(app);
    string(app);
};