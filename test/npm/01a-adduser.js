'use strict';

var expect = require('chai').expect
  , npm = require('./npm')
  , path = require('path')
  , reg = 'http://localhost:3000/'
  , conf = path.resolve(__dirname, 'fixtures', 'npmrc')
  , fs = require('fs')
  ;

try { fs.unlinkSync(conf); } catch (er) { }

describe('NPM adduser', function () {

  it('should add user', function (done) {
    var c = npm([
      '--registry=' + reg,
      '--userconf=' + conf,
      'adduser'
    ]);

    c.stderr.pipe(process.stderr);

    var buf = '';

    c.stdout.setEncoding('utf8');

    c.stdout.on('data', function(d) {
      buf += d;
      if (buf.match(/: /)) {
        switch (buf.split(':')[0]) {
          case 'Username':
            c.stdin.write('user' + '\r');
            break;
          case 'Password':
            c.stdin.write('random' + '\r');
            break;
          case 'Email':
            c.stdin.end('email@example.com' + '\r');
            break;
          default:
            throw 'wtf: ' + JSON.stringify(buf);
        }
        buf = '';
      }
    });

    c.on('exit', function(code) {
      expect(code).to.equal(0);
      done();
    });

  });

});
