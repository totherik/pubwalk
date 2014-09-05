'use strict';

var DataSource = require('../lib/datasource');
var Levee = require('levee');


module.exports = function (options) {
    var ds, breaker;

    options = options || {};

    ds = new DataSource(options.datasource);
    breaker = Levee.createBreaker(ds, { maxFailures: 1, resetTimeout: 5000 });

    return function db(req, res, next) {
        breaker.run(null, function (err, db) {
            req.db = db;
            next(err);
        });
    };
};