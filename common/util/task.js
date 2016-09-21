var CronJob = require('cron').CronJob;
var Promise = require('es6-promise').Promise;

var CONFIG = require('../../config');

var ArticleDAO = require('../db/models/article');
var HistoryDAO = require('../db/models/history');
var CmtCountDAO = require('../db/models/cmtCount');
var CommentsDAO = require('../db/models/comments');
var TmpDAO = require('../db/models/tmp');

var zhAPI = require('../api/index-promise');

var Spider = require('./spider');
var DateCalc = require('./date');

var historyDAO = new HistoryDAO(),
    articleDAO = new ArticleDAO(),
    commentsDAO = new CommentsDAO(),
    cmtCountDAO = new CmtCountDAO(),
    tmpDAO = new TmpDAO();


var Task = {
    start: function(){
        this.daily();
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
        }, true, 'Asia/Shanghai');

        // 扫描 tmp 表中的id 重新爬数据
    },
    
    // 每周三、日 00:30 更新前7天的评论点赞数
    weekly: function(){
        new CronJob('00 30 00 * * 0', function(){
            var start = new DateCalc().before(),
                end = new DateCalc().before(7);
            Task._weeklySave(start, end);
        }, function(){
            console.log('weekly cron-job over ')
        }, true, 'Asia/Shanghai');

        new CronJob('00 30 00 * * 3', function(){
            var start = new DateCalc().before(),
                end = new DateCalc().before(7);
            Task._weeklySave(start, end);
        }, function(){
            console.log('weekly cron-job over ')
        }, true, 'Asia/Shanghai');

    },
    _weeklySave: function(start, end){
        var aidsArr = [];
        return cmtCountDAO.search({dtime: start})
            .then(function(d){
                console.log('search over')
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
                console.log('delete over @'+ start)
                var promiseArr = [];
                // 重新爬取
                while(aidsArr.length>0){
                    var aid = aidsArr.pop();
                    promiseArr.push(Spider.cmtCount(aid, start));
                }
                return Promise.all(promiseArr);
            })
            .then(function(){
                console.log('save over @' + start)
                var date = new DateCalc(start).before();
                if(date != end){
                    Task._weeklySave(date,end)
                }else {
                    console.log('save over ===========')
                }
                return promise.resolve(start);
            })
            .catch(function(err){
                return promise.resolve(start);
            })
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

module.exports = Task;