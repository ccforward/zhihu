// 爬虫入口
// var Spider = require('./spider');


var request = require('request');
// var md5 = require('md5');
// console.log(md5('qau'));return;


var opt = {
    // uri: 'http://api.ishenka.com/art/web/index.php?r=user/resetpwdsms',
    uri: 'http://service.winic.org:8009/sys_port/gateway/?id=heivr.sms.new.oa&pwd=admin123&to=18661982110&content=111&time=',
    // uri: 'http://http://api.ishenka.com/art/web/index.php?r=user/register',
    form: {
        
    }
}


request(opt, function(err, response, body){
    console.log(body);
});

// Spider.init('20150819', '20150810');


