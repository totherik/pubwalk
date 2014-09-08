'use strict';

var pine = require('pine');
var Levee = require('levee');
var Promise = require('Promise');
var fastpath = require('fastpath');
var Get = require('../lib/http_get');


module.exports = function (router) {
    var log, venuesPath, venuePath, beersPath;

    log = pine();
    venuesPath = fastpath('$.response.groups[*].items[*].venue.id');
    venuePath = fastpath('$.response.venue.items[0].venue_id');
    beersPath = fastpath('$.response.venue.top_beers.items[*].beer.beer_name');

    router.get('/nearby', function (req, res, next) {
        var options;

        log.info('Looking up venues near %s', req.query.ll);

        options = {
            pathname: '/v2/venues/explore',
            query: {
                v: '20130815',
                section: 'drinks',
                ll: req.query.ll
            }
        };

        req.foursquare.get(options)
            .then(function (payload) {
                var venues = venuesPath.evaluate(payload);

                log.info('Found %d venues near %s', venues.length, req.query.ll);

                if (venues.length) {
                    return req.untappd.get({
                        pathname: '/v4/venue/foursquare_lookup/' + venues[0]
                    });
                }

                return {};
            })
            .then(function (payload) {
                var venueIds = venuePath.evaluate(payload);

                if (venueIds.length) {
                    return req.untappd.get({
                        pathname: '/v4/venue/info/' + venueIds[0]
                    });
                }

                return {};
            })
            .then(function (payload) {
                var beers;

                beers = {
                    venue: {
                        venue_id: payload.response.venue.venue_id,
                        venue_name: payload.response.venue.venue_name,
                        location: payload.response.venue.location
                    },
                    beers: beersPath.evaluate(payload)
                };

                log.info('Found %d beers.', beers.beers.length);
                return res.json(beers);
            })
            .catch(next);

    });

};