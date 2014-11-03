'use strict';

var expect = require('chai').expect
  , fs = require('fs')
  , path = require('path')
  , npm = require('./npm')
  , reg = 'http://localhost:3000/'
  , conf = path.resolve(__dirname, 'fixtures', 'npmrc')
  , install = path.resolve(__dirname, 'fixtures', 'install')
  , nodeModules = path.resolve(install, 'node_modules')
  ;

describe('NPM update', function () {

  it('should update package', function (done) {
    var c = npm([ 
      '--registry=' + reg,
      '--userconf=' + conf,
      'update'
    ], { cwd: install });
    var v = '';
    c.stdout.on('data', function(d) {
      v += d;
    });
    c.on('close', function(code) {
      expect(code).to.equal(0);
      fs.exists(nodeModules, function (exists) {
        expect(exists).to.equal(true);
        fs.readFile(path.resolve(nodeModules, 'package', 'package.json'), function (err, data) {
          expect(err).to.equal(null);
          var json = JSON.parse(data);
          expect(json.version).to.equal('0.0.1');
          done();
        });
      });
    });
  });

});
