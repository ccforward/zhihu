// 爬虫入口
var Spider = require('./spider');


var request = require('request');
var md5 = require('md5');
// console.log(md5('qau'));return;

// var opt = {
//     method: 'POST',
//     uri: 'http://edu.ishenka.com/frontend/web/index.php?r=auth/valid',
//     // uri: 'http://edu.ishenka.com/frontend/web/index.php?r=user/repwd',
//     // uri: 'http://edu.ishenka.com/frontend/web/index.php?r=user/register',
//     // uri: 'http://edu.ishenka.com/frontend/web/index.php?r=user/login',
//     // uri: 'http://edu.ishenka.com/frontend/web/index.php?r=version/check',
//     // uri: 'http://edu.ishenka.com/frontend/web/index.php?r=user/logout',
//     form: {
//         user: 'edition',
//         pwd: 'ishenka.com',
//         secret: 'F4260480BZTR6VLTH048',
//         udid: 'd0660d844b99e6f6bea249ea53b23b6f'
//         // prodCode: 'edition',
//         // // user: 'edition',
//         // // pwd: 'ishenka.com',
//         // // secret: 'RT26V84486Z08TBPBFRH',
//         // // udid: '9B39ABAC-82FD-4585-8E5D-605C6DF8D52A'
//         // phone: '18661982110',
//         // // phone: '18661982110',
//         // password: 'qau',
//         // // re_password: 'qwert',
//         // mac: '123',
//         // pwd1: 'qau',
//         // pwd2: 'qau',
//         // code: '235779',
//         // registe_ip: '0.0.0.0'
//     }
// }
// request(opt, function(err, response, body){
//     // console.log(err);return;
//     var salt = 'bmlnZXNoYWJpamluZ3JhbmdlaXBvbGU=';

//     var code = md5(md5(opt.form.secret)+salt);
//     console.log(body);
//     console.log(code);

// });


Spider.init('20150731', '20150721');


