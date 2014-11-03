'use strict';

var spawn = require('child_process').spawn
  , isWin = /^win/.test(process.platform)
  , fs = require('fs')
  ;

module.exports = function (args, opts) {

  var cmd = 'npm';

  if (isWin) {
    cmd = 'C:\\Program Files\\nodejs\\npm.cmd';
    if (!fs.existsSync(cmd)) {
      console.error('ERROR: cannot find path to npm on windows in ' +
        __filename);
    }
  }

  // had issues with proxy, i hate proxies, no proxy
  args.push('--no-proxy');

  var npm = spawn(cmd, args, opts);
  
  npm.on('error', function () {
    //console.log('npm error', err)
  });

  //npm.stderr.pipe(process.stderr)

  return npm;

};
