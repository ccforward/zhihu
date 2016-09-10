var CronJob = require('cron').CronJob;
var Promise = require('es6-promise').Promise;

var config = require('../../config');

var ArticleDAO = require('../db/models/article');
var HistoryDAO = require('../db/models/history');
var CmtCountDAO = require('../db/models/cmtCount');
var CommentsDAO = require('../db/models/comments');
var LogDAO = require('../db/models/log');

var zhAPI = require('../api/index-promise');
var DateCalc = require('./date');

var historyDAO = new HistoryDAO(),
    articleDAO = new ArticleDAO(),
    logDAO = new LogDAO(),
    commentsDAO = new CommentsDAO(),
    cmtCountDAO = new CmtCountDAO();

var Spider = {
    init: function(start, end){
        // Spider.daily();
        // Spider.day(start);

        historyDAO.count({dtime: start}).then(function(d){
            start = new DateCalc(start).after();
            end = new DateCalc(end).after();

            // 每20秒一次 config.spider.interval == 20
            // var interval = '*/' + config.spider.interval + ' * * * * *';
            var interval = '*/5 * * * * *';
            var spiderJob = new CronJob(interval, function(){
                if(d == 0){
                    Spider.day(end);
                    var dateCalc = new DateCalc(end);
                    end = dateCalc.after();
                    if(start == end){
                        setTimeout(function(){
                            Spider.day(end);
                        }, config.spider.interval * 1000)
                        spiderJob.stop()
                    }
                }else {
                    spiderJob.stop()
                }
            }, null, true, 'Asia/Shanghai');
        });

    },
    // 一天的数据
    day: function(date){
        zhAPI.getHistory(date).then(function(history){
            var hDate = history.date,
                d = history.stories,
                promiseAll = [];
            for(var i = 0, len = d.length;i<len;i++){
                var data = {
                    id: d[i].id,
                    title: d[i].title,
                    image: d[i].images.length ? d[i].images[0] : '',
                    theme: d[i].theme ? d[i].theme.id : 0,
                    type: d[i].type || '0',
                    dtime: hDate,
                    dmonth: hDate.substr(0,6),
                    dyear: hDate.substr(0,4)
                };
                var p = Spider.history(data)
                        .then(function(data){
                            return Spider.article(data.aid, data.dtime);
                        })
                        .then(function(data){
                            return Spider.cmtLong(data.aid, data.dtime);
                        })
                        .then(function(data){
                            return Spider.cmtShort(data.aid, data.dtime);
                        })
                        .then(function(data){
                            return Spider.cmtCount(data.aid, data.dtime);
                        })
                        .catch(function(e){
                            console.log('day history data error @id: ' + data.id, e);
                        });
                promiseAll.push(p);
            }

            Promise.all(promiseAll).then(function(){
                console.log('\nday history data over @: ' + date);
            }).catch(function(error){
                console.log('get ' + hDate + ' data error: ', error)
            });;

        });
    },
    history: function(data){
        return historyDAO.save(data)
                .then(function(err){
                    return Promise.resolve({aid:data.id, dtime: data.dtime});
                })
                .catch(function(err){
                    var log = {
                        id: data.id,
                        err: config.spider.errHistory,
                        date: data.dtime,
                        msg: err
                    };
                    console.log('get history error @id: ' + data.id);
                    return logDAO.save(log);
                })
    },
    // 正文
    article: function(aid, dtime){
        return zhAPI.getArticle(aid).then(function(article){
            var data = {
                id: aid,
                title: article.title,
                body: article.body,
                image: article.image,
                css: article.css,
                js: article.js,
                imageSource: article.image_source,
                shareUrl: article.share_url,
                dtime: dtime,
                dmonth: dtime.substr(0,6),
                dyear: dtime.substr(0,4)
            }
            return articleDAO.save(data)
                    .then(function(){
                        console.log('article over ' + aid);
                        return Promise.resolve({aid: aid, dtime: dtime});
                    })
                    .catch(function(err){
                        var log = {
                            id: aid,
                            err: config.spider.errArticle,
                            date: dtime,
                            msg: err
                        };
                        console.log('article save error @aid: ' + aid)
                        logDAO.save(log);
                        return Spider.article(aid, dtime);
                    });
        });
    },
    // 长评论
    cmtLong: function(aid, dtime){
        return zhAPI.getCmtLong(aid)
        .then(function(cmts){
            var data = {
                aid: aid,
                comments: cmts.comments,
                type: 1,
                dtime: dtime,
                dmonth: dtime.substr(0,6),
                dyear: dtime.substr(0,4)
            }
            return commentsDAO.save(data)
                    .then(function(err){
                        // console.log('cmtLong over ' + aid);
                        return Promise.resolve({aid: aid, dtime: dtime});
                    })
                    .catch(function(err){
                        var log = {
                            id: aid,
                            err: config.spider.errComments,
                            date: dtime,
                            msg: err
                        };
                        logDAO.save(log);
                        return Spider.cmtLong(aid, dtime);
                    });
        })
        .catch(function(err){
            var log = {
                id: aid,
                err: config.spider.errComments,
                date: dtime,
                msg: err
            };
            console.log('long comments save error @aid: ' + aid)
            logDAO.save(log);
            return Spider.cmtLong(aid, dtime);
        });
    },
    // 短评论
    cmtShort: function(aid, dtime){
        return zhAPI.getCmtshort(aid)
        .then(function(cmts){
            var data = {
                aid: aid,
                comments: cmts.comments,
                type: 0,
                dtime: dtime,
                dmonth: dtime.substr(0,6),
                dyear: dtime.substr(0,4)
            }
            return commentsDAO.save(data)
                    .then(function(){
                        // console.log('cmtShort over ' + aid);
                        return Promise.resolve({aid: aid, dtime: dtime});
                    })
                    .catch(function(err){
                        var log = {
                            id: aid,
                            err: config.spider.errComments,
                            date: dtime,
                            msg: err
                        };
                        console.log('short comments save error @aid: ' + aid)
                        logDAO.save(log);
                        return Spider.cmtShort(aid, dtime);
                    });
        })
        .catch(function(err){
            var log = {
                id: aid,
                err: config.spider.errComments,
                date: dtime,
                msg: err
            };
            console.log('short comments save error @aid: ' + aid)
            logDAO.save(log);
            return Spider.cmtShort(aid, dtime);
        });
    },
    // 评论数
    cmtCount: function(aid, dtime){
        return zhAPI.getCmtcount(aid)
        .then(function(count){
            var data = {
                aid: aid,
                comments: count.comments || 0,
                longComments: count.long_comments || 0,
                shortComments: count.short_comments || 0,
                popularity: count.popularity || 0,
                dtime: dtime,
                dmonth: dtime.substr(0,6),
                dyear: dtime.substr(0,4)
            }
            return cmtCountDAO.save(data)
                    .then(function(){
                        // console.log('cmtCount over ' + aid);
                        return Promise.resolve({aid: aid, dtime: dtime});
                    })
                    .catch(function(err){
                        var log = {
                            id: aid,
                            err: config.spider.errComments,
                            date: dtime,
                            msg: err
                        };
                        console.log('comments count save error @aid: ' + aid)
                        logDAO.save(log);
                        return Spider.cmtCount(aid, dtime);
                    });
        })
        .catch(function(err){
            var log = {
                id: aid,
                err: config.spider.errComments,
                date: dtime,
                msg: err
            };
            console.log('comments count save error @aid: ' + aid)
            logDAO.save(log);
            return Spider.cmtCount(aid, dtime);
        });
    },
    


    // 每天23:30 爬取每日的 latest 数据
    daily: function(){
        new CronJob('00 30 23 * * *', function(){
            zhAPI.getLatest().then(function(latest){
                var d = latest.stories,
                    date = latest.date;
                for(var i=0,len=d.length; i<len; i++){
                    Spider._dailySave(date, d[i]);
                }
            });
        }, function(){
            console.log('cron-job over @date:' + date)
        }, true, 'Asia/Shanghai')
    },
    _dailySave: function(date, data){
        var his = {
            id    : data.id,
            title : data.title,
            image : data.images.length ? data.images[0] : '',
            theme : data.theme ? data.theme.id : 0,
            type  : data.type || '0',
            dtime : date,
            dmonth: date.substr(0,6),
            dyear : date.substr(0,4)
        };

        historyDAO.save(his)
            .then(function(){
                return Spider.article(data.id, date);
            })
            .catch(function(err){
                var log = {
                    id: data.id,
                    err: config.spider.errDaily,
                    date: dtime,
                    msg: err
                };
                console.log('daily save error @aid: ' + data.id)
                logDAO.save(log);
            });
    }
}


module.exports = Spider;





