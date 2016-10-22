var express = require('express');
var router = express.Router();

var home = require('./../controller/home');
var statis = require('./../controller/statis');
var spiderErr = require('./../controller/spiderErr');


router.get('/', home.index);

// 每日的latest数据
router.get('/latest', home.getLatest);

// 按日期查询
router.get('/day/:day', home.searchDate);
router.get('/month/:month', home.searchDate);

// 文章detail
router.get('/article/:aid', home.getArticle);

// 评论
router.get('/article/:aid/comments/count', home.getCmtCount);
router.get('/article/:aid/comments', home.getComments);
router.get('/article/:aid/comments/long', home.getCmtLong);
router.get('/article/:aid/comments/short', home.getCmtShort);

// 手动处理爬虫错误
router.get('/spider-error', spiderErr.list);
router.post('/clear-error/:dtime', spiderErr.clear);

// 统计
router.get('/statistics', statis.index);
router.get('/statistics/month/:dmonth', statis.statisMonth);
// 统计api
router.get('/api-statis/month/:dmonth', statis.searchDate);
router.get('/api-statis/articles/:aids', statis.searchArticles);




module.exports = router;
