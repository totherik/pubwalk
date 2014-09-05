'use strict';

var pine = require('pine');


module.exports = function () {
    var log = pine();

    return function fourohfour(req, res, _) {
        res.statusCode = 404;
        res.format({
            json: function () {
                res.send({ error: 'Not found.' });
            },
            text: function () {
                res.send('Not found.');
            },
            html: function () {
                res.send('<p>Not found.</p>');
            }
        });

        log.warn(req.originalUrl || req.url, 404);
    };

};