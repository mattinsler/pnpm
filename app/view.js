'use strict';

var hljs = require('highlight.js')
  , marked = require('marked')
  , moment = require('moment')
  , commands = require('../commands')
  ;

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  }
});

exports.setup = function (app, storage) {

  app.get('/', function (req, res) {
    storage.all(function (err, packages) {
      if (err) {
        res.json(err);
      } else {
        res.render('home', {
          packages: packages,
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
    storage.one(req.params.name, function (err, pkg) {
      if (err) {
        res.status(404).render('404', { 
          name: req.params.name
        });
      } else {
        res.render('package', {
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
