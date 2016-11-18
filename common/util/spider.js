"use strict";
const CronJob = require('cron').CronJob;
const Promise = require('es6-promise').Promise;

const CONFIG = require('../../config');

const ArticleDAO = require('../db/models/article');
const HistoryDAO = require('../db/models/history');
const CmtCountDAO = require('../db/models/cmtCount');
const CommentsDAO = require('../db/models/comments');
const LatestDAO = require('../db/models/latest');
const TmpDAO = require('../db/models/tmp');

const zhAPI = require('../api/index-promise');

const DateCalc = require('./date');

const historyDAO = new HistoryDAO();
const articleDAO = new ArticleDAO();
const cmtCountDAO = new CmtCountDAO();
const commentsDAO = new CommentsDAO();
const latestDAO = new LatestDAO();
const tmpDAO = new TmpDAO();


// ============== BAE node-log ==============
let logger = console;
if(!CONFIG.log.openBae){
    logger = require('log4js').getLogger('cheese');
}


const Spider = {
    fire(start, end){
        // Spider.day(start);
        historyDAO.count({dtime: start}).then(function(d){
            if(d>0){
                return ;
            }
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
    // date.before() 的数据 
    day(date){
        return zhAPI.getHistory(date).then(function(history){
            var hDate = history.date,
                d = history.stories,
                promiseAll = [];
            for(var i = 0, len = d.length;i<len;i++){
                var data = {
                    id: d[i].id,
                    title: d[i].title,
                    image: d[i].images ? d[i].images[0] : '',
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
                logger.info('day history data over @: ' + new DateCalc(date).before());
                return Promise.resolve('day history data over @: ' + new DateCalc(date).before());
            }).catch(function(err){
                logger.error('get ' + hDate + ' data error: ', err);
            });
        });
    },

    dayRefresh(dtime){
        var query = {dtime: dtime};
        return tmpDAO.count({dtime: dtime})
            .then(function(d){
                if(d == 0){
                    return Promise.reject('over');
                }else {
                    return historyDAO.delete(query) 
                }
            })
            .then(function(){
                return articleDAO.delete(query);
            })
            .then(function(){
                return commentsDAO.delete(query);
            })
            .then(function(){
                return cmtCountDAO.delete(query);
            })
            .then(function(){
                Spider.day(new DateCalc(dtime).after())
                    .then(function(){
                        return tmpDAO.delete(query);
                    })
            }).
            catch(function(err){
                tmpDAO.save({aid: '', dtime: dtime});
                return Promise.reject(err);
            })
    },

    dataOne(data, date){
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
                tmpDAO.save({aid: '', dtime: data.dtime});
                logger.error('day @' + date + 'history data error @id: ' + data.id, e);
            });
    },

    history(data){
        return historyDAO.save(data)
                .then(function(err){
                    return Promise.resolve({aid:data.id, dtime: data.dtime});
                })
                .catch(function(err){
                    tmpDAO.save({aid: '', dtime: dtime});
                    logger.error('get history error @id: ' + data.id, err);
                });
    },
    // 正文
    article(aid, dtime, latest){
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
                dyear: dtime.substr(0,4),
                latest: latest ? true : false
            }
            return articleDAO.save(data)
                    .then(function(){
                        // console.log('article over ' + aid);
                        return Promise.resolve({aid: aid, dtime: dtime});
                    })
                    .catch(function(err){
                        logger.error('article save error @aid: ' + aid, err);
                    });
        })
        .catch(function(err){
            tmpDAO.save({aid: aid, dtime: dtime});
            logger.error('article save error @id: ' + aid, err);
        });
    },
    // 长评论
    cmtLong(aid, dtime){
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
            tmpDAO.save({aid: aid, dtime: dtime});
            logger.error('long comments save error @id: ' + aid, err);
        });
    },
    // 短评论
    cmtShort(aid, dtime){
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
            tmpDAO.save({aid: aid, dtime: dtime});
            logger.error('short comments save error @aid: ' + aid, err);
        });
    },
    // 评论数
    cmtCount(aid, dtime){
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
            tmpDAO.save({aid: aid, dtime: dtime});
            logger.error('comments count save error @aid: ' + aid, err);
        });
    },

    // 评论数更新
    updateCmtCount(start, end){
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
    latest(){
        var dtime = new DateCalc().now(),
            topID = [],
            latestID = [];
        articleDAO.delete({latest: true})
            .then(function(){
                return latestDAO.delete()
            }).then(function(){
                return zhAPI.getLatest()
            })
            .then(function(d){
                var dtime = d.date,
                    stories = d.stories,
                    top = d.top_stories,
                    promiseAll = [];
                for(var i = 0, len = top.length;i<len;i++){
                    topID.push(top[i].id);
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
                    latestID.push(stories[i].id);
                    var data = {
                        id: stories[i].id,
                        title: stories[i].title,
                        image: stories[i].images ? stories[i].images[0] : '',
                        top: false,
                        dtime: dtime
                    };
                    var p = latestDAO.save(data);
                    promiseAll.push(p)
                }
                return Promise.all(promiseAll);
            })
            .then(function(){
                for(let x = 0, xLen = topID.length; x<xLen; x++){
                    Spider.article(topID[x], dtime, true);
                }
                for(let m = 0, mLen = latestID.length; m<mLen; m++){
                    Spider.article(latestID[m], dtime, true);
                    zhAPI.getCmtcount(latestID[m]).then(function(count){
                        var data = {
                            id: latestID[m],
                            comments: count.comments || 0,
                            popularity: count.popularity || 0,
                            dtime: dtime
                        }
                        latestDAO.save(data);
                    })
                }
            })
            .catch(function(err){
                logger.error('get lastest data error: ', err);
            })
    }
}


module.exports = Spider;





