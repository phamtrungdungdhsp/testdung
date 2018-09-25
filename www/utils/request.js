var request = require('request');

exports.postData = function (host, port, path, data) {
    request({
        url: `http://${host}:${port}${path}`,
        method: "POST",
        json: true,
        body: data
    }, function (error, response, body){

    });
};