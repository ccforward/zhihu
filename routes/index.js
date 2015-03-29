var express = require('express');
var router = express.Router();

var dailyAPI = require('./../src/action/api')

/* GET home page. */
// dailyData.getArticle();

// router.get('/', function(req, res) {
//     dailyData.getArticle();
//     res.render('index', { title: 'Daily' });
// });

router.get('/', dailyAPI.getStart);
router.get('/index', dailyAPI.getStart);
router.get('/article/:id', dailyAPI.getArticle);

module.exports = router;
