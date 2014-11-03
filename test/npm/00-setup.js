'use strict';

// setup registry server for testing
var spawn = require('child_process').spawn
  , http = require('http')
  , reg = 'http://localhost:3000'
  , url = require('url')
  , path = require('path')
  , fs = require('fs')
  , db = path.resolve(__dirname, '../../db')
  , log = fs.createWriteStream(path.resolve(__dirname, '../../srv.log'))
  , server = null
  , expect = require('chai').expect
  , rm = require('rimraf')
  ;

describe('NPM registry server', function () {

  it('should clean up before testing', function (done) {
    // remove database file to reset registry
    rm(db, done);
  });

  it('should spawn app server', function (done) {

    // spin up a new server instance
    server = spawn('node', [path.resolve(__dirname, '../../server.js')]);

    // direct all server output to log file
    server.stdout.pipe(log);
    server.stderr.pipe(log);

    // give server some time to setup (could be a possible cause of issues
    // when testing)
    setTimeout(function () { 
      var r = url.parse(reg);
      r.method = 'HEAD';
      r.headers = { connection: 'close' };
      http.request(r, function (res) {
        expect(res.statusCode).to.equal(200);
        done();
      }).end();
    }, 500);

  });
});

// kill server on exit
process.on('exit', function () {
  server.kill();
});
