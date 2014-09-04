'use strict';

var pine = require('pine');

module.exports = function () {
    var log = pine();

    return function (err, req, res, _) {
        res.statusCode = 500;
        res.format({
            json: function () {
                res.send({ error: 'Something broke, we are on this!' });
            },
            text: function () {
                res.send('Something broke, we are on this!');
            },
            html: function () {
                res.send('<p>Something broke, we are on this!</p>');
            }
        });

        log.error(err.stack || err.message);
    };

};