'use strict';

var http = require('http');
var pine = require('pine');
var express = require('express');
var kraken = require('kraken-js');


var log, options, app, server;

// Create logger with global defaults for use until
// application is initialized.
log = pine();

/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
options = {
    onconfig: function (config, next) {
        /*
         * Add any additional config setup or overrides here. `config` is an initialized
         * `confit` (https://github.com/krakenjs/confit/) configuration object.
         */

        // Set pine configuration as loaded from kraken-js and reinitialize
        // current logger to pick up new defaults. This means that any file loaded
        // by kraken (middleware, routes, etc.) must wait to create a logger until
        // invoked, not at module initialization time.
        pine.configure(config.get('pine'));
        log = pine();

        next(null, config);
    }
};

app = module.exports = express();
app.use(kraken(options));
app.on('start', function () {
    log.info('Application ready to serve requests.');
    log.info('Environment: %s', app.kraken.get('env:env'));
});



/*
 * Create and start HTTP server.
 */
if (!module.parent) {

    /*
     * This is only done when this module is run directly, e.g. `node .` to allow for the
     * application to be used in tests without binding to a port or file descriptor.
     */
    server = http.createServer(app);
    server.listen(process.env.PORT || 8000);
    server.on('listening', function () {
        log.info('Server listening on http://localhost:%d', this.address().port);
    });

}