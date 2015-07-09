
var Spider = require('./spider');


var i = 0;

new CronJob('* * * * * *', function(){

    console.log('i : ' + ++i);
}, null, true, 'Asia/Shanghai')

Spider.init(12,34);


