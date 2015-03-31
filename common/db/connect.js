var mongoose = require('mongoose');

var config = require('../../config').mongo;

var dbUrl = config.url();
var dbOption = config.mongoOptions;
mongoose.connect(dbUrl, dbOption);

exports.mongoose = mongoose;