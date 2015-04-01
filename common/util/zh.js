var ArticleDAO = require('../db/models/article');
var HistoryDAO = require('../db/models/history');
var zhAPI = require('../api/index');
var CronJob = require('cron').CronJob;
// Asia/Shanghai


// var dao = new ArticleDAO();

// console.log(dao.save(obj));
// articleDAO.save(obj);

var i = 0;

new CronJob('* * * * * *', function(){

    console.log('i : ' + ++i);
}, null, true, 'Asia/Shanghai')




var x = 1
var historyDAO = new HistoryDAO();
new CronJob('* * * * * *', function(){
    if(x == 2){
        zhAPI.getHistory('20150401').then(function(history){
            // var d = latest.stories,
            //     date = latest.date;
            console.log(history);
            // for(var i=0,len=d.length; i<len; i++){
            //     var data = {
            //         id   : d[i].id,
            //         title: d[i].title,
            //         image: d[i].images[0],
            //         dtime: date
            //     }
            //     historyDAO.save(data);
            // }
        });
    }
    console.log('x : ' + ++x);
}, null, true, 'Asia/Shanghai')

