'use strict';

var request = require('request')
  , config = require('../config')
  , url = require('url')
  , cache = require('../lib/cache')
  , NPM_REGISTRY = 'http://registry.npmjs.org'
  ;

// set default proxy
if (process.env.proxy || config.proxy) {
  request.defaults({
    proxy: process.env.proxy || config.proxy
  });
}

var replaceTarballUrls = function (obj) {
  Object.keys(obj.versions).forEach(function (v) {
    var parsed = url.parse(obj.versions[v].dist.tarball);
    obj.versions[v].dist.tarball = url.resolve(process.env.DOMAIN || config.domain, parsed.path);
  });
};

exports.metadata = function (req, res) {
  cache.get(req.params.pkg, function (err, doc) {
    if (err) {
      request(NPM_REGISTRY + req.path, function (err, proxy, body) {
        body = JSON.parse(body);
        // forward npmjs errors
        if (!body.error) {
          replaceTarballUrls(body);
          cache.put(body._id, body);
        }
        res.status(proxy.statusCode).set(proxy.headers).json(body);
      });
    } else {
      req.log('getting ' + req.params.pkg + ' from cache...');
      res.status(200).json(doc);
    }
  });
};

exports.tarball = function (req, res) {
  cache.get(req.params.tar, function (err, body) {
    if (err) {
      request(NPM_REGISTRY + req.path, { encoding: null }, function (err, resp, body) {
        cache.put(req.params.tar, body);
      }).pipe(res);
    } else {
      req.log('getting ' + req.params.tar + ' from cache...');
      res.send(new Buffer(body, 'binary'));
    }
  });
};
