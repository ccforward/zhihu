var CronJob = require('cron').CronJob;
var Promise = require('es6-promise').Promise;

var CONFIG = require('../../config');

var ArticleDAO = require('../db/models/article');
var HistoryDAO = require('../db/models/history');
var CmtCountDAO = require('../db/models/cmtCount');
var CommentsDAO = require('../db/models/comments');
var LatestDAO = require('../db/models/latest');
var TmpDAO = require('../db/models/tmp');

var zhAPI = require('../api/index-promise');

var DateCalc = require('./date');

var historyDAO = new HistoryDAO(),
    articleDAO = new ArticleDAO(),
    cmtCountDAO = new CmtCountDAO(),
    commentsDAO = new CommentsDAO(),
    latestDAO = new LatestDAO(),
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
    fire: function(start, end){
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
                var p = Spider.dataOne(data, hDate);
                promiseAll.push(p);
            }

            Promise.all(promiseAll).then(function(){
                // logger.info('day history data over @: ' + new DateCalc(date).before());
            }).catch(function(err){
                logger.error('get ' + hDate + ' data error: ', err);
            });;

        });
    },

    dataOne: function(data, date){
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
            var section = article.section || {id: null, name: null}
            var data = {
                id: aid,
                title: article.title,
                body: article.body,
                image: article.image,
                css: article.css,
                js: article.js,
                imageSource: article.image_source,
                shareUrl: article.share_url,
                section: article.section || {},
                sectionId: section.id || '',
                sectionName: section.name || '',
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

    // 评论数更新
    updateCmtCount: function(start, end){
        var aidsArr = [];
        return cmtCountDAO.search({dtime: start})
            .then(function(d){
                if(d.length){
                    for(var i=0;i<d.length;i++){
                        aidsArr.push(d[i].aid);
                    }
                    return cmtCountDAO.delete({aid: {$in: aidsArr}}) 
                }else {
                    return Promise.reject('delete over')
                }
            })
            .then(function(){
                // logger.info('delete over @: ' + start);
                var promiseArr = [];
                while(aidsArr.length>0){
                    var aid = aidsArr.pop();
                    promiseArr.push(Spider.cmtCount(aid, start));
                }
                return Promise.all(promiseArr);
            })
            .then(function(){
                var date = new DateCalc(start).before();
                if(date != end){
                    Spider.updateCmtCount(date, end)
                }
                return Promise.resolve(start);
            })
            .catch(function(err){
                logger.error('update error : ' + err);
                return Promise.resolve(start);
            })
    },

    // 每日最新内容 latest
    latest: function(){
        var dtime = new DateCalc().before();
        latestDAO.delete({dtime: dtime})
            .then(function(){
                return zhAPI.getLatest()
            })
            .then(function(d){
                var dtime = d.date,
                    stories = d.stories,
                    top = d.top_stories,
                    promiseAll = [];
                for(var i = 0, len = top.length;i<len;i++){
                    var data = {
                        id: top[i].id,
                        title: top[i].title,
                        image: top[i].image,
                        top: true,
                        dtime: dtime
                    };
                    var p = latestDAO.save(data);
                    promiseAll.push(p)
                }
                for(var i = 0, len = stories.length;i<len;i++){
                    var data = {
                        id: stories[i].id,
                        title: stories[i].title,
                        image: stories[i].images.length ? stories[i].images[0] : '',
                        top: false,
                        dtime: dtime
                    };
                    var p = latestDAO.save(data);
                    promiseAll.push(p)
                }
                return Promise.all(promiseAll);
            })
            .catch(function(err){
                logger.error('get lastest data error: ', err);
            })
    }
}


module.exports = Spider;





