var Promise = require('es6-promise').Promise;
var _ = require('lodash');
var logger = require('log4js').getLogger('cheese');

var CmtCountDAO = require('../common/db/models/cmtCount');
var StatisDAO = require('../common/db/models/statis');

var cmtCountDAO = new CmtCountDAO(),
    statisDAO = new StatisDAO();


module.exports = {
    start: function(start, end){
        this.run(start)
    },
    run: function(dmonth){
        cmtCountDAO.search({dmonth: dmonth})
            .then(function(d){
                // 每月 star总和
                var starsSum = _.sumBy(d, function(o){
                    return o.popularity
                })
                // 按 star 排序
                var sortStars = _.slice(_.orderBy(d, ['popularity'],['desc']), 0, 10),
                    countStar = [],
                    aidsStar = [];
                for(var s=0,sLen=sortStars.length;s<sLen;s++){
                    countStar.push(sortStars[s].popularity)
                    aidsStar.push(sortStars[s].aid)
                }
                
                // 每月 comments总和
                var commentSum = _.sumBy(d, function(o){
                    return o.comments
                })
                // 按 comments 排序
                var sortComment = _.slice(_.orderBy(d, ['comments'],['desc']), 0, 10),
                    countCmt = [],
                    aidsCmt = [];
                for(var c=0,cLen=sortComment.length;c<cLen;c++){
                    countCmt.push(sortComment[c].comments)
                    aidsCmt.push(sortComment[c].aid)
                }


                statisDAO.save({
                    type   : 'star',
                    sum    : starsSum,
                    count  : countStar,
                    aids   : aidsStar,
                    dmonth : dmonth,
                    dyear  : dmonth.substr(0,4)
                }).catch(function(err){
                    logger.error('statistic star error @dmonth: ' + dmonth);
                });
                statisDAO.save({
                    type   : 'comments',
                    sum    : commentSum,
                    count  : countCmt,
                    aids   : aidsCmt,
                    dmonth : dmonth,
                    dyear  : dmonth.substr(0,4)
                }).catch(function(err){
                    logger.error('statistic comments error @dmonth: ' + dmonth);
                });
                
            }).catch(function(err){
                logger.error('statistic error @dmonth: ' + dmonth);
            })
    }
}