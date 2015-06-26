var express = require('express');
var router = express.Router();

var home = require('./../controller/home');

/* GET home page. */
// dailyData.getArticle();

// router.get('/', function(req, res) {
//     dailyData.getArticle();
//     res.render('index', { title: 'Daily' });
// });

router.get('/', home.getLatest);
router.get('/index.htm', home.getLatest);
router.get('/list.htm', home.list);
router.get('/s/:key', home.search);
// router.get('/article/:id', dailyAPI.getArticle);

module.exports = router;
