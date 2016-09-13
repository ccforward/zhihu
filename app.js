var fs = require('fs');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var FileStreamRotator = require('file-stream-rotator');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

// 爬虫入口 每天23点爬知乎日报的 latest 
var CONFIG = require('./config');
var Spider = require('./common/util/spider');
// Spider.init(CONFIG.spider.start, CONFIG.spider.end);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));

// ============== log4js init ==============
if(CONFIG.log.isOpenningNode){
    var log4js = require('log4js');
    log4js.loadAppender('file');
    log4js.configure({
        appenders: [
            { type: 'console' },
            { type: 'file', filename: './log/cheese.log', category: 'cheese' }
        ]
    });
}
// ============== log4js init ==============


// ============== HTTP log ==============
if(CONFIG.log.isOpenningHTTP){
    var logDirectory = path.join(__dirname, 'log');
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
    var accessLogStream = FileStreamRotator.getStream({
        date_format: 'YYYYMMDD',
        filename: path.join(logDirectory, 'access-%DATE%.log'),
        frequency: 'daily',
        verbose: false
    });
    app.use(morgan('combined', { stream: accessLogStream }));
}
// ============== HTTP log ==============

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    // next(err);
    res.render('error', {
        message: err.message,
        error: err
    });
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
