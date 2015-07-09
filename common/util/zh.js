var CronJob = require('cron').CronJob;
var Promise = require('es6-promise').Promise;

var ArticleDAO = require('../db/models/article');
var HistoryDAO = require('../db/models/history');
var zhAPI = require('../api/index');
var DateCalc = require('./date');
// Asia/Shanghai


// var dao = new ArticleDAO();

// console.log(dao.save(obj));
// articleDAO.save(obj);

// var i = 0;

// new CronJob('* * * * * *', function(){

//     console.log('i : ' + ++i);
// }, null, true, 'Asia/Shanghai')

var start = '20150708',
    end = '20150707';

var x = 1;
var historyDAO = new HistoryDAO();

var Spider = {
    init: function(start, end){
        console.log(start, end);
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
                historyDAO.save(data);
            }
        });
    },
    loopData: function(start, end){
        var _self = this;
        var date = start;
        var dateCalc = new DateCalc(start);
        _self.day(date);
        date = dateCalc.before();  

        if(date === end){
            _self.day(date);
        }else {
            setTimeout(function(){
                _self.loopData(date,end);
            }, 100);
        }
    }

}

module.exports = Spider;
Spider.init(start, end);




