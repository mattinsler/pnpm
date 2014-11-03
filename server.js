'use strict';

// the purpose of this file to to bring in the express application and
// start a server instance
var app = require('./app')();

// If all of the routes fail!!1
app.use(function(req, res){
    
    res.status(404);

    if (req.accepts('json')) {
      // respond with json
      res.json({
        error:'not_found', 
        reason:'document not found'
      });
    } else {
      // default to plain-text.send()
      res.type('txt').send('Not found');
    }

});

// start listening on the specified port or port 3000 (default)
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
