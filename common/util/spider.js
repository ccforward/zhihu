var CronJob = require('cron').CronJob;
var Promise = require('es6-promise').Promise;

var CONFIG = require('../../config');

var ArticleDAO = require('../db/models/article');
var HistoryDAO = require('../db/models/history');
var CmtCountDAO = require('../db/models/cmtCount');
var CommentsDAO = require('../db/models/comments');
var TmpDAO = require('../db/models/tmp');

var zhAPI = require('../api/index-promise');



var DateCalc = require('./date');

var historyDAO = new HistoryDAO(),
    articleDAO = new ArticleDAO(),
    commentsDAO = new CommentsDAO(),
    cmtCountDAO = new CmtCountDAO(),
    tmpDAO = new TmpDAO();


// ============== BAE node-log ==============
if(CONFIG.log.openBae){
    var log4js = require('log4js');
    log4js.loadAppender('baev3-log');
    var options = {
        'user': 'ntOYKO0PROCl3vaIPZtgDxdA',
        'passwd': '98EyyHiq5glG0odrNGc0gxx50BaTFmYY'
    }
    log4js.addAppender(log4js.appenders['baev3-log'](options));
    var logger = log4js.getLogger('node-log-sdk');
    logger.setLevel('TRACE');
}else {
    var logger = require('log4js').getLogger('cheese');
}


var Spider = {
    init: function(start, end){
        Spider.daily();
        // Spider.day(start);

        historyDAO.count({dtime: start}).then(function(d){
            start = new DateCalc(start).after();
            end = new DateCalc(end).after();

            var interval = '*/' + CONFIG.spider.interval + ' * * * * *';
            var spiderJob = new CronJob(interval, function(){
                if(d == 0){
                    Spider.day(end);
                    var dateCalc = new DateCalc(end);
                    end = dateCalc.after();
                    if(start == end){
                        setTimeout(function(){
                            Spider.day(end);
                        }, CONFIG.spider.interval * 1000)
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
                var p = Spider.dataOne(data);
                promiseAll.push(p);
            }

            Promise.all(promiseAll).then(function(){
                logger.info('day history data over @: ' + date);
            }).catch(function(err){
                logger.error('get ' + hDate + ' data error: ', err);
            });;

        });
    },

    dataOne: function(data){
        return Spider.history(data)
            .then(function(d){
                return Spider.article(d.aid, d.dtime);
            })
            .then(function(d){
                return Spider.cmtLong(d.aid, d.dtime);
            })
            .then(function(d){
                return Spider.cmtShort(d.aid, d.dtime);
            })
            .then(function(d){
                return Spider.cmtCount(d.aid, d.dtime);
            })
            .catch(function(e){
                tmpDAO.save({aid: this.id, dtime: data.dtime});
                logger.error('day @' + date + 'history data error @id: ' + data.id, e);
            });
    },

    history: function(data){
        return historyDAO.save(data)
                .then(function(err){
                    return Promise.resolve({aid:data.id, dtime: data.dtime});
                })
                .catch(function(err){
                    logger.error('get history error @id: ' + data.id, err);
                });
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
                        // console.log('article over ' + aid);
                        return Promise.resolve({aid: aid, dtime: dtime});
                    })
                    .catch(function(err){
                        logger.error('article save error @aid: ' + aid, err);
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
                        logger.error('get cmtLong error @id: ' + aid, err);
                    });
        })
        .catch(function(err){
            logger.error('long comments save error @id: ' + aid, err);
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
                        logger.error('get cmtShort error @id: ' + aid, err);
                    });
        })
        .catch(function(err){
            logger.error('short comments save error @aid: ' + aid, err);
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
                        logger.error('get cmtCount error @id: ' + aid, err);
                    });
        })
        .catch(function(err){
            logger.error('comments count save error @aid: ' + aid, err);
        });
    },
    


    daily: function(){
        // 每天23:30 爬取每日的 latest 数据
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
        }, true, 'Asia/Shanghai');

        // 扫描 tmp 表中的id 重新爬数据
        
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
                logger.error('daily save error @aid:  ' + data.id, err);
            });
    }
}


module.exports = Spider;





