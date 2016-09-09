var express = require('express');
var router = express.Router();

var home = require('./../controller/home');


// 每日的latest数据
router.get('/', home.getLatest);
router.get('/index.html', home.getLatest);

// 按日期查询
router.get('/d/:day', home.searchDate);
router.get('/m/:month', home.searchDate);
// router.get('/y/:year', home.searchDate);

// 文章detail 
router.get('/article/:aid', home.getArticle);

// 评论
router.get('/cmt/count/:aid', home.getCmtCount);
router.get('/cmt/long/:aid', home.getCmtLong);
router.get('/cmt/short/:aid', home.getCmtShort);




module.exports = router;
