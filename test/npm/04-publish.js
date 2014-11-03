'use strict';

var expect = require('chai').expect
  , path = require('path')
  , npm = require('./npm')
  , reg = 'http://localhost:3000/'
  , conf = path.resolve(__dirname, 'fixtures', 'npmrc')
  , pkg = path.resolve(__dirname, 'fixtures/package')
  , pkg001 = path.resolve(pkg, '0.0.1')
  , http = require('http')
  , url = require('url')
  ;

describe('NPM publish new version', function () {

  it('should publish first package', function (done) {
    
    var c = npm([
      '--registry=' + reg,
      '--userconf=' + conf,
      'publish'
    ], { cwd: pkg001 });

    c.stderr.pipe(process.stderr);
    var out = '';
    c.stdout.setEncoding('utf8');

    c.stdout.on('data', function (d) {
      out += d;
    });

    c.on('close', function (code) {
      expect(code).to.equal(0);
      expect(out).to.equal('+ package@0.0.1\n');
      done();
    });

  });

  it('should have the old tarball', function (done) {
    var r = url.parse(reg + 'package/-/package-0.0.0.tgz');
    r.method = 'HEAD';
    r.headers = { connection: 'close' };
    http.request(r, function (res) {
      expect(res.statusCode).to.equal(200);
      done();
    }).end();
  });

  it('should have uploaded tarball', function (done) {
    var r = url.parse(reg + 'package/-/package-0.0.1.tgz');
    r.method = 'HEAD';
    r.headers = { connection: 'close' };
    http.request(r, function (res) {
      expect(res.statusCode).to.equal(200);
      done();
    }).end();
  });

});
