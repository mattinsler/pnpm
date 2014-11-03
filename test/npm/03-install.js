'use strict';

var expect = require('chai').expect
  , fs = require('fs')
  , rm = require('rimraf')
  , path = require('path')
  , npm = require('./npm')
  , reg = 'http://localhost:3000/'
  , conf = path.resolve(__dirname, 'fixtures', 'npmrc')
  , install = path.resolve(__dirname, 'fixtures', 'install')
  , nodeModules = path.resolve(install, 'node_modules')
  ;

describe('NPM install', function () {

  it('should clean up last install', function (done) {
    rm(nodeModules, function () {
      fs.exists(nodeModules, function (exists) {
        expect(exists).to.equal(false);
        done();
      });
    });
  });

  it('should install package', function (done) {
    var c = npm([ 
      '--registry=' + reg,
      '--userconf=' + conf,
      'install',
      'package'
    ], { cwd: install });
    var v = '';
    c.stdout.on('data', function(d) {
      v += d;
    });
    c.on('close', function(code) {
      expect(code).to.equal(0);
      fs.exists(nodeModules, function (exists) {
        expect(exists).to.equal(true);
        done();
      });
    });
  });

});
