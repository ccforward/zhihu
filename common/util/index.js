var Util = {
    init: function(){
        console.log('init');
    }
}

// new CronJob('* * * * * *', function(){
//     if(x == 2){
//         console.log('===========  begin request  ===========');
//         zhAPI.getLatest().then(function(latest){
//             var d = latest.stories,
//                 date = latest.date;
//             // console.dir(latest);
//             console.log('===========  over request  ===========');
//             console.log(x);
//             for(var i=0,len=d.length; i<len; i++){
//                 var img = '';
//                 if(d[i].images){
//                     img = d[i].images[0];
//                 }
//                 var data = {
//                     id   : d[i].id,
//                     title: d[i].title,
//                     image: img,
//                     dtime: date,
//                     dyear: date.substr(0,4)
//                 }
//                 historyDAO.save(data);
//             }
//         });
//     }
//     ++x;
//     // console.log('x : ' + ++x);
// }, function(){
//     console.log('cron-job over')
// }, true, 'Asia/Shanghai')
