'use strict';

var Levee = require('levee');
var Assert = require('assert');
var Promise = require('promise');
var Get = require('../lib/http_get');


module.exports = function (options) {
    var httpGet;

    Assert.ok(options, 'Configuration options are required.');
    Assert.ok(options.propertyName, 'A property name is required.');
    Assert.ok(options.hostname, 'A hostname is required.');

    httpGet = Levee.createBreaker(new Get(options.hostname));

    return function fsquare(req, res, next) {

        req[options.propertyName] = {
            get: function (options) {
                return new Promise(function (resolve, reject) {
                    httpGet.run(options, function (err, req, payload) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(payload);
                    });
                });
            }
        };

        next();
    };
};