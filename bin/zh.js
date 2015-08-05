#!/usr/bin/env node

var debug = require('debug')('my-application');
var app = require('../app');

app.set('port', process.env.PORT || 5502);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

