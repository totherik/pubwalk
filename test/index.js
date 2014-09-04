/*global describe:false, it:false, before:false, beforeEach:false, afterEach:false*/
'use strict';

var assert = require('assert');
var request = require('supertest');


describe('/', function () {
    var app;


    before(function (done) {
        app = require('../');
        app.on('start', done);
    });


    it('should say "ok"', function (done) {
        request(app)
            .get('/')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {

                assert.ifError(err);
                assert.ok(res.status, 'ok');

                done();
            });
    });

});
