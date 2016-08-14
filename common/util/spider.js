var CronJob = require('cron').CronJob;
var Promise = require('es6-promise').Promise;

var config = require('../../config');

var ArticleDAO = require('../db/models/article');
var HistoryDAO = require('../db/models/history');
var CmtCountDAO = require('../db/models/cmtCount');
var LogDAO = require('../db/models/log');

var zhAPI = require('../api/index');
var DateCalc = require('./date');


// cronjob 测试
// var i = 0;
// new CronJob('* * * * * *', function(){

//     console.log('i : ' + ++i);
// }, null, true, 'Asia/Shanghai')
// return;

var historyDAO = new HistoryDAO(),
    articleDAO = new ArticleDAO(),
    logDAO = new LogDAO(),
    cmtCountDAO = new CmtCountDAO();

var x = 0;

var Spider = {
    init: function(start, end){
        start = new DateCalc(start).after();
        end = new DateCalc(end).after();
        // Spider.daily();
        // return;

        var dateCalc = new DateCalc(start);
        historyDAO.count({dtime: dateCalc.before()}).then(function(d){
            // end一定要比start靠前
            d == 0 && Spider.loopDayData(start, end);
        });
    },
    // 一天的数据
    day: function(date, callback){
        zhAPI.getHistory(date).then(function(history){
            var date = history.date,
                d = history.stories,
                promiseAll = [];
            for(var i = 0, len = d.length;i<len;i++){
                let data = {
                    id: d[i].id,
                    title: d[i].title,
                    image: d[i].images.length ? d[i].images[0] : '',
                    theme: d[i].theme ? d[i].theme.id : 0,
                    type: d[i].type || '0',
                    dtime: date,
                    dmonth: date.substr(0,6),
                    dyear: date.substr(0,4)
                };
                let p = historyDAO.save(data)
                        .then(function(err){
                            if(err){
                                var log = {
                                    id: data.id,
                                    err: config.spider.errHistory,
                                    date: date,
                                    msg: JSON.parse(err)
                                };
                                console.log('get history error ' + data.id);
                                return logDAO.save(error);
                            }else {
                                return Promise.resolve(data.id);
                            }
                        })
                        .then(function(aid){
                            return Spider.article(aid)
                        })
                        .then(function(aid){

                        })
                promiseAll.push(p);
            }

            Promise.all(promiseAll).then(function(err){
                callback();
            });

        });
    },
    // 正文
    article: function(aid){
        zhAPI.getArticle(aid).then(function(article){
            var data = {
                id: article.id,
                title: article.title,
                body: article.body,
                image: article.image,
                css: article.css,
                js: article.js,
                imageSource: article.image_source,
                shareUrl: article.share_url
            }
            articleDAO.save(data)
                .then(function(err){
                    if(err){
                        var log = {
                            id: data.id,
                            err: config.spider.errArticle,
                            date: '',
                            msg: JSON.parse(err)
                        };
                        console.log('article save error: ' + data.id)
                        return logDAO.save(error);
                    }else {
                        return Promise.resolve(aid);
                    }
                });
        });
    },
    // 长评论
    cmtLong: function(aid){
        zhAPI.getArticle(aid).then(function(article){
            var data = {
                id: article.id,
                title: article.title,
                body: article.body,
                image: article.image,
                css: article.css,
                js: article.js,
                imageSource: article.image_source,
                shareUrl: article.share_url
            }
            articleDAO.save(data)
                .then(function(err){
                    if(err){
                        var log = {
                            id: data.id,
                            err: config.spider.errArticle,
                            date: '',
                            msg: JSON.parse(err)
                        };
                        console.log('article save error: ' + data.id)
                        return logDAO.save(error);
                    }else {
                        return Promise.resolve(aid);
                    }
                });
        });
    },
    // 评论数
    cmtCount: function(articleId){
        zhAPI.getCmtcount(articleId).then(function(count){
            var d = {
                id: articleId,
                longComments: count.long_comments ? count.long_comments : 0,
                popularity: count.popularity ? count.popularity : 0,
                shortComments: count.short_comments ? count.short_comments : 0,
                comments: count.comments ? count.comments : 0
            }
            cmtCountDAO.save(d).then(function(err){
                if(err){
                    var date = new Date();
                    var error = {
                        id: data.id,
                        err: 2,
                        date: [d.getFullYear(), '-', Spider._cover(d.getMonth()+1), '-', Spider._cover(d.getDate())].join(''),
                        msg: JSON.parse(err)
                    };
                    console.log(error)
                    logDAO.save(error);                    
                }                
            })
        });
    },
    _cover: function(num){
        var n = parseInt(num, 10);
        return n < 10 ? '0' + n : n;
    },
    loopDayData: function(start, end){
        var _self = this,
            date = start,
            dateCalc = new DateCalc(start);

        // _self.day(date);
        
        _self.day(date, function(){
            date = dateCalc.before();
            if(date == end){
                _self.day(date);
            }else {
                _self.loopDayData(date,end);
            }
        });
    },


    // 每天23:30 爬取每日的 latest 数据
    daily: function(){
        // new CronJob('00 30 23 * * *', function(){
        new CronJob('* * * * * *', function(){
            console.log(x++)
            if(x==1){
                zhAPI.getLatest().then(function(latest){
                    var d = latest.stories,
                        date = latest.date;
                    for(var i=0,len=d.length; i<len; i++){
                    }
                });
            }else {
                return;
            }
        }, function(){
            console.log('cron-job over')
        }, true, 'Asia/Shanghai')
    },
    _dailySave: function(data){
        var img = '';
        if(data.images){
            img = data.images[0];
        }
        var his = {
            id   : data.id,
            title: data.title,
            image: img,
            theme: theme,
            dtime: date,
            dyear: date.substr(0,4),
            dmonth: date.substr(0,6)
        };   
        console.log(his); 
        return;
        historyDAO.save(his).then(function(err){
            var log = {
                id: data.id,
                err: 0,
                date: date,
                msg: 'Daily cron-job over'
            };
            console.log(err)
            if(err){
                // 写入存储error的log
                log.err = 0;
                log.msg = JSON.parse(err);
            }
            logDAO.save(log);
        });
    }
}


module.exports = Spider;





