var CronJob = require('cron').CronJob;
var Promise = require('es6-promise').Promise;

var ArticleDAO = require('../db/models/article');
var HistoryDAO = require('../db/models/history');
var LogDAO = require('../db/models/log');
var zhAPI = require('../api/index');
var DateCalc = require('./date');


// cronjob 测试
// var i = 0;

// new CronJob('* * * * * *', function(){

//     console.log('i : ' + ++i);
// }, null, true, 'Asia/Shanghai')


var historyDAO = new HistoryDAO();
var logDAO = new HistoryDAO();
var Spider = {
    init: function(start, end){
        var dateCalc = new DateCalc(start)
        historyDAO.count({dtime: dateCalc.before()}).then(function(d){
            // end一定要比start小
            d == 0 && Spider.loopData(start, end);
        });
        // end一定要比start小
        // this.loopData(start, end)
    },
    // 一天的数据
    day: function(date){
        zhAPI.getHistory(date).then(function(history){
            var date = history.date,
                d = history.stories;
            for(var i = 0, len = d.length;i<len;i++){
                var img = '',
                    theme = 0;
                if(d[i].images){
                    img = d[i].images[0];
                }
                if(d[i].theme){
                    theme = d[i].theme.id;
                    t = d[i].theme.name;
                }
                var data = {
                    id: d[i].id,
                    title: d[i].title,
                    image: img,
                    theme: theme,
                    dtime: date,
                    dmonth: date.substr(0,6),
                    dyear: date.substr(0,4)
                };
                // console.log(theme);
                historyDAO.save(data).then(function(err){
                    if(err){
                        // 写入存储error的log
                        var error = {
                            id: data.id,
                            msg: JSON.parse(err)
                        }
                        logDAO.save(error);
                    }
                });
            }
        });
    },
    loopData: function(start, end){
        var _self = this,
            date = start,
            dateCalc = new DateCalc(start);

        _self.day(date);
        date = dateCalc.before();  
        if(date == end){
            _self.day(date);
            console.log('over');
        }else {
            setTimeout(function(){
                _self.loopData(date,end);
            }, 100);
        }
    },
    // 每天23:30 爬取每日的 latest 数据
    daily: function(){
        new CronJob('00 30 23 * * *', function(){
            zhAPI.getLatest().then(function(latest){
                var d = latest.stories,
                    date = latest.date;
                for(var i=0,len=d.length; i<len; i++){
                    var img = '';
                    if(d[i].images){
                        img = d[i].images[0];
                    }
                    var data = {
                        id   : d[i].id,
                        title: d[i].title,
                        image: img,
                        dtime: date,
                        dyear: date.substr(0,4)
                    }
                    historyDAO.save(data).then(function(err){
                        if(err){
                            // 写入存储error的log
                            var error = {
                                id: data.id,
                                msg: JSON.parse(err)
                            }
                            logDAO.save(error);
                        }
                    });
                    console.log('cron-job daily over')
                }
            });
        }, function(){
            console.log('cron-job over')
        }, true, 'Asia/Shanghai')
    }

}

module.exports = Spider;





