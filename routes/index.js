'use strict';

var pine = require('pine');


module.exports = function (router) {
    var log = pine();

    router.get('/:bid', function (req, res, next) {
        var db, bid;

        db = req.db;
        bid = parseInt(req.params.bid, 10);

        log.info('Requested beer id %d', bid);

        if (isNaN(bid)) {
            next();
            return;
        }

        db.collection('beer').findOne({ bid: 3558 }, function (err, beer) {
            if (err || !beer) {
                next(err);
                return;
            }

            res.json(beer);
        });
    });

};