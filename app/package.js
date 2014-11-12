'use strict';

var proxy = require('./proxy')
  ;

exports.setup = function (app, storage) {

  app.get('/:pkg', function (req, res, next) {
    storage.one(req.params.pkg, function (err, pkg) {
      if (err) {
        next();
      } else {
        res.json(pkg);
      }
    });
  }, proxy.metadata);

  app.get('/-/all', function (req, res) {
    storage.all(function (err, pkgs) {
      if (err) {
        throw err;
      } else {
        pkgs._updates = Date.now();
        res.json(pkgs);
      }
    });
  });

  app.get('/-/all/since', function (req, res) {
    storage.all(function (err, docs) {
      if (err) {
        throw err;
      } else {
        res.json(docs);
      }
    });
  });

  app.get('/:pkg/-/:tar', function (req, res, next) {
    storage.tar(req.params.pkg, req.params.tar, function (err, tar) {
      if (err) {
        next();
      } else {
        res.send(tar).end();
      }
    });
  }, proxy.tarball);

  var updatePackage = function (req, res) {
    storage.store(req, function (err) {
      if (err) {
        err.error = err.forbidden;
        res.status(400).json(err);
      } else {
        res.status(200).end();
      }
    });
  };

  app.put('/:pkg', updatePackage);
  app.put('/:pkg/-rev/:revision', updatePackage);

  app.delete('/:pkg/-rev/:revision', function (req, res) {
    storage.remove(req, function (err) {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).end();
      }
    });
  });

  app.delete('/:pkg/-/:tar/-rev/:revision', function (req, res) {
    storage.removeTar(req.params, function (err) {
      if (err) {
      } else {
        res.status(200).end();
      }
    });
  });

};
