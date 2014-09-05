'use strict';

var Mongo = require('mongodb');
var Promise = require('promise');


/**
 * A Levee command object implementation for a database connection.
 * @param options
 * @constructor
 */
function DataSource(options) {
    options = options || {};

    this.url = options.url || Mongo.Db.DEFAULT_URL;
    this._promise = undefined;
    this._connect();
}


/**
 * The command implementation `execute` method.
 * @param _ (unused)
 * @param callback the callback invoked when the operation is complete.
 */
DataSource.prototype.execute = function (_, callback) {
    var self = this;
    this._promise.then(function (db) {
        callback(null, db);
    }, function (err) {
        self._connect();
        callback(err);
    });
};


DataSource.prototype._connect = function () {
    var self, uri;

    self = this;
    uri = this.url;

    this._promise = new Promise(function (resolve, reject) {
        Mongo.Db.connect(uri, { server: { auto_reconnect: true } }, function (err, db) {
            if (err) {
                reject(err);
                return;
            }

            db.on('close', function (server, db) {
                self._promise = Promise.reject(new Error('mongodb server disconnected.'));

                server.once('reconnect', function () {
                    self._promise = Promise.resolve(db);
                });
            });

            resolve(db);
        });
    });
};


module.exports = DataSource;