'use strict';

// the purpose of this file to to bring in the express application and
// start a server instance
var fs = require('fs')
  , ejs = require('ejs')
  , logo = fs.readFileSync('./logo.txt', 'utf8')
  , pkg = require('./package')
  , config = require('./config')
  , app = require('./app')()
  ;

// If all of the routes fail!!
app.use(function(req, res){
    
  res.status(404).json({
    error:'not_found', 
    reason:'document not found'
  });

});

// start listening on the config port
app.listen(config('port'), function () {
  if (config('logo')) {
    console.log(ejs.render(logo, {
      meta: pkg,
      process: process,
      config: config
    }));
  } else {
    console.log('\n> pnpm@' + pkg.version);
    console.log('> host: ' + config('domain') + ':' + config('port'));
    console.log('> pid: ' + process.pid);
    console.log('> db: ' + config('db').driver + '\n');
  }
});
