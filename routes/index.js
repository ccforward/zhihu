var express = require('express');
var router = express.Router();

var home = require('./../controller/home');
var ana = require('./../controller/ana');


// 每日的latest数据
router.get('/', home.getLatest);
router.get('/latest', home.getLatest);

// 按日期查询
router.get('/day/:day', home.searchDate);
router.get('/month/:month', home.searchDate);
// router.get('/y/:year', home.searchDate);

// 文章detail
router.get('/article/:aid', home.getArticle);

// 评论
router.get('/article/:aid/comment/count', home.getCmtCount);
router.get('/article/:aid/comment/long', home.getCmtLong);
router.get('/article/:aid/comment/short', home.getCmtShort);



router.get('/analysis', ana.index);




module.exports = router;
