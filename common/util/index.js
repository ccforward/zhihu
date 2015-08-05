// 爬虫入口
var Spider = require('./spider');


var request = require('request');
var md5 = require('md5');
// console.log(md5('qau'));return;

var prefix  = 'http://127.0.0.1/sk/';
// var prefix  = 'http://edu.ishenka.com/';
var opt = {
    method: 'POST',
    // uri: prefix+'frontend/web/index.php?r=auth/valid',
    // uri: prefix+'frontend/web/index.php?r=user/repwd',
    // uri: prefix+'frontend/web/index.php?r=user/registersms',
    // uri: prefix+'frontend/web/index.php?r=user/register',
    // uri: prefix+'frontend/web/index.php?r=user/login',
    // uri: prefix+'frontend/web/index.php?r=user/logout',
    // uri: prefix+'frontend/web/index.php?r=version/check',
    // uri: prefix+'frontend/web/index.php?r=user/logout',
    // uri: prefix+'frontend/web/index.php?r=user/checkloginstatus',
    // uri: prefix+'frontend/web/index.php?r=user/checkloginddevice',
    uri: prefix+'frontend/web/index.php?r=user/activation',
    form: {
        // userId: '67',
        // user: 'edition',
        // pwd: 'ishenka.com',
        // secret: 'F4260480BZTR6VLTH048',
        // udid: 'd0660d844b99e6f6bea249ea53b23b6f',
        // prodCode: 'edition',
        // user: 'edition',
        // pwd: 'ishenka.com',
        // secret: 'RT26V84486Z08TBPBFRH',
        // udid: '11EB64DA-A095-430A-88E3-255606ACCDFB',
        phone: '15066168659',
        sn: 'UEKTHYAZ',
        // password: 'aaa',
        // s: '123',
        // agent: 'Android OS 5.4.4 / API-19 (KTU84P/V6.6.2.0.KXDCNCF)',
        // re_password: 'aaa',
        mac: '18:59:36:1d:5d:a5'
        // agent: 'Android OS 4.4.4 / API-19 (KTU84P/V6.6.2.0.KXDCNCF)',
        // pwd1: 'qau',
        // pwd2: 'qau',
        // code: '185548',
        // registe_ip: '0.1.0.123'
    }
}
request(opt, function(err, response, body){
    // console.log(err);return;
    var salt = 'bmlnZXNoYWJpamluZ3JhbmdlaXBvbGU=';

    var code = md5(md5(opt.form.secret)+salt);
    console.log(body);
    // console.log(code);

});


// Spider.init('20150730', '20150729');


