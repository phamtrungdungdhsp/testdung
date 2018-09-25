"use strict";

const BASE_COLL = require('./intalize/base-coll');
module.exports = BASE_COLL("tbUser", {
        email: String,
        username: String,
        password: String,
        status: Boolean,
        isActive: Boolean,
});
