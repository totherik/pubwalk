'use strict';

var Url = require('url');
var pine = require('pine');
var Http = require('http');
var Https = require('https');
var Morgan = require('morgan');

var HOSTNAME = process.env.HOSTNAME;
var CLIENT_ID = process.env.CLIENT_ID;
var CLIENT_SECRET = process.env.CLIENT_SECRET;


var log, server;

log = pine();
server = Http.createServer();

server.on('request', function proxy(req, res) {
    var path, options, child;

    path = Url.parse(req.url, true);

    // Update just the path portion, adding tokens
    path.href = null;
    path.protocol = null;
    path.host = null;
    path.auth = null;
    path.hostname = null;
    path.slashes = null;
    path.search = null;
    path.port = null;
    path.query = path.query || {};
    path.query['client_id'] = CLIENT_ID;
    path.query['client_secret'] = CLIENT_SECRET;

    options = Url.parse(req.url);
    options.search = null;
    options.query = null;
    options.pathname = null;
    options.method = req.method;
    options.protocol = 'https:';
    options.hostname = HOSTNAME;
    options.path = path.format();
    options.agent = false;

    child = Https.request(options, function (child_res) {

        log.info(Morgan['remote-addr'](req, child_res), '"' + Morgan['method'](req, child_res), Morgan['url'](req, child_res), 'HTTP/' + Morgan['http-version'](req, child_res) + '"', child_res.statusCode);

        res.writeHead(child_res.statusCode, child_res.headers);
        child_res.pipe(res, {
            end: true
        });
    });

    req.pipe(child, {
        end: true
    });
});

server.on('listening', function startup() {
    log.info('Listening on port %d', this.address().port);
});

server.listen();


