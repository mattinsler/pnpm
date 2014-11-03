'use strict';

var expect = require('chai').expect
  , path = require('path')
  , npm = require('./npm')
  , reg = 'http://localhost:3000/'
  , conf = path.resolve(__dirname, 'fixtures', 'npmrc')
  , pkg = path.resolve(__dirname, 'fixtures/package')
  , pkg000 = path.resolve(pkg, '0.0.0')
  , http = require('http')
  , url = require('url')
  ;

var time = {};
var npmVersion = null;

var maintainers = [
  {
    'name': 'user',
    'email': 'email@example.com'
  }
];

var version000 = {
  'name': 'package',
  'version': '0.0.0',
  'description': 'just an npm test',
  '_id': 'package@0.0.0',
  'dist': {
    'tarball': 'http://localhost:3000/package/-/package-0.0.0.tgz'
  },
  '_from': '.',
  '_npmUser': {
    'name': 'user',
    'email': 'email@example.com'
  },
  'maintainers': [
    {
      'name': 'user',
      'email': 'email@example.com'
    }
  ],
  'directories': {}
};

describe('NPM publish', function () {

  it('should get npm version', function (done) {
    
    var c = npm([ '--version' ]);
    var v = '';
    c.stdout.on('data', function(d) {
      v += d;
    });
    c.on('close', function(code) {
      expect(code).to.equal(0);
      npmVersion = v.trim();
      version000._npmVersion = npmVersion;
      done();
    });
  });

  it('should publish first package', function (done) {
    
    var c = npm([
      '--registry=' + reg,
      '--userconf=' + conf,
      'publish'
    ], { cwd: pkg000 });

    c.stderr.pipe(process.stderr);
    var out = '';
    c.stdout.setEncoding('utf8');

    c.stdout.on('data', function (d) {
      out += d;
    });

    c.on('close', function (code) {
      expect(code).to.equal(0);
      expect(out).to.equal('+ package@0.0.0\n');
      done();
    });

  });

  it('should have uploaded tarball', function (done) {
    var r = url.parse(reg + 'package/-/package-0.0.0.tgz');
    r.method = 'HEAD';
    r.headers = { connection: 'close' };
    http.request(r, function (res) {
      expect(res.statusCode).to.equal(200);
      done();
    }).end();
  });

  it('should GET after publish', function(done) {
    var result = {
      '_id': 'package',
      'name': 'package',
      'description': 'just an npm test',
      'dist-tags': {
        'latest': '0.0.0'
      },
      'versions': {
        '0.0.0': version000
      },
      'readme': 'just an npm test\n',
      'maintainers': maintainers,
      'time': time,
      'readmeFilename': 'README',
      '_attachments': {
        'package-0.0.0.tgz': {
          'content_type': 'application/octet-stream',
          'revpos': 1,
          'stub': true
        }
      }
    };

    http.get(reg + 'package', function(res) {
      expect(res.statusCode).to.equal(200);
      var c = '';
      res.setEncoding('utf8');
      res.on('data', function(d) {
        c += d;
      });
      res.on('end', function() {
        c = JSON.parse(c);
        // rev and time will be different
        expect(c._rev).to.match(/^1-[0-9a-f]+$/);
        result._rev = c._rev;
        result.time['0.0.0'] = c.time['0.0.0'];
        //expect(c).to.deep.equal(result)
        done();
      });
    });
  });

  it('should fail to clobber', function (done) {
    var c = npm([
      '--registry=' + reg,
      '--userconf=' + conf,
      'publish'
    ], { cwd: pkg000 });
    c.on('close', function(code) {
      // npm couldn't republish package
      expect(code).to.not.equal(0);
      done();
    });
  });

});
