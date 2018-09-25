"use strict";

const util = require('util');
const timeUtils = require('../../utils/time_utils');
const stringUtils = require('../../utils/string_utils');
const hostCf = require('../../config/cf_host');

module.exports = function (app) {
    app.locals.formattringaP = function (languageKey, key, data) {
        return util.format(language.getLanguage(key, languageKey), data);
    };

    app.locals.formattringaP2 = function (languageKey, key, data, data2) {
        return util.format(language.getLanguage(key, languageKey), data, data2);
    };

    app.locals.randomString = function () {
        return `${stringUtils.randomStringFixLengthOnlyAlphabet(5)}`;
    };

    app.locals.getApiUrl = function () {
        return `http://${hostCf.api_ip}:${hostCf.api_port}`;
    };
};