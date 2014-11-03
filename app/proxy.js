'use strict';

var request = require('request')
  , config = require('../config')
  , url = require('url')
  , NPM_REGISTRY = 'http://registry.npmjs.org'
  ;

// set default proxy
if (process.env.proxy || config.proxy) {
  request.defaults({ 'proxy': process.env.proxy || config.proxy });
}

var replaceTarballUrls = function (obj) {
  Object.keys(obj.versions).forEach(function (v) {
    var parsed = url.parse(obj.versions[v].dist.tarball);
    obj.versions[v].dist.tarball = url.resolve(process.env.DOMAIN || config.domain, parsed.path);
  });
};

exports.metadata = function (req, res) {
  request(NPM_REGISTRY + req.path, function (err, proxy, body) {
    body = JSON.parse(body);
    // forward npmjs errors
    if (!body.error) {
      replaceTarballUrls(body);
    }
    res.status(proxy.statusCode).set(proxy.headers).json(body);
  });
};

exports.tarball = function (req, res) {
  request(NPM_REGISTRY + req.path).pipe(res);
};
