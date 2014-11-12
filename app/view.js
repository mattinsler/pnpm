'use strict';

var hljs = require('highlight.js')
  , marked = require('marked')
  , moment = require('moment')
  , commands = require('../commands')
  , packages = require('../lib/packages')
  , meta = require('../package')
  ;

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  }
});

exports.setup = function (app) {

  app.get('/', function (req, res) {
    packages.all(function (err, pkgs) {
      if (err) {
        res.json(err);
      } else {
        res.render('home', {
          meta: meta,
          packages: pkgs,
          query: req.query.q || '',
          randomCommand: function () {
            var index = Math.ceil(Math.random()*1000) % commands.length;
            return commands[index];
          }
        });
      }
    });
  });

  app.get('/package/:name', function (req, res) {
    packages.one(req.params.name, function (err, pkg) {
      if (err) {
        res.status(404).render('404', { 
          meta: meta,
          name: req.params.name
        });
      } else {
        res.render('package', {
          meta: meta,
          hljs: hljs,
          marked: marked,
          package: pkg,
          formatDate: function (d) {
            var date = moment(d);
            return date.fromNow();
          }
        });
      }
    });
  });
  
};
