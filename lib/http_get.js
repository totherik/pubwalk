'use strict';

var Url = require('url');
var Wreck = require('wreck');


function HttpGet(hostname) {
    this.hostname = hostname;
}


HttpGet.prototype.execute = function httpGet(options, callback) {
    var url;

    url = Url.parse(this.hostname);
    url.pathname = options.pathname;
    url.query = options.query;

    Wreck.get(url.format(), { json:true, agent: false }, function (err, res, payload) {
        if (err) {
            callback(err);
            return;
        }

        if (res.statusCode >= 400) {
            err = new Error('Server Error');
            err.code = res.statusCode;
            callback(err);
            return;
        }

        callback.apply(null, arguments);
    });
};


module.exports = HttpGet;