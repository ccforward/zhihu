var request = require('request');
var Promise = require('es6-promise').Promise;
var zhAPI = require('./../common/api/index-promise');
var HistoryDAO = require('../common/db/models/history');
var ArticleDAO = require('../common/db/models/article');
var CmtCountDAO = require('../common/db/models/cmtCount');
var CommentsDAO = require('../common/db/models/comments');
var cheerio = require('cheerio')
var URL = require('url');

var Home = {
    // 获取最新内容
    getLatest: function(req, res){
        Promise.all([zhAPI.getStartPic(), zhAPI.getLatest()]).then(function(result){
            var pic = result[0];
            var latest = result[1];
            res.render('index', { 'title': 'Daily', 'pic':pic, 'latest':latest.stories});
        });
    },
    
    // 文章详情
    getArticle: function(req, res){
        var aid = req.params.aid;
        if(aid) {
            var articleDAO = new ArticleDAO();
            articleDAO.search(aid).then(function(result){
                if(result){
                    //  HTML实体转换 http://www.cnblogs.com/zichi/p/5135636.html
                    var $ = cheerio.load(result.body, {decodeEntities: false});
                    $('img').each(function(idx, item){
                        $(item).attr('src','http://ccforward.sinaapp.com/api/proxy.php?url=' + $(item).attr('src'))
                    });
                    result.body = $.root().html();
                }
                if(req.headers.vary == 'pjax'){
                    res.json(result)
                }else {
                    res.render('article', {'data': result, 'title': 'Article'});
                }
            });
        }else {
            // res.redirect('/index')
        }
    },

    getCmtCount: function(req, res){
        var aid = req.params.aid;
        if(aid) {
            var cmtCountDAO = new CmtCountDAO();
            cmtCountDAO.search(aid).then(function(result){
                res.json(result);
            });
        }
    },
    getCmtLong: function(req, res){
        var aid = req.params.aid;
        if(aid) {
            var commentsDAO = new CommentsDAO();
            commentsDAO.search({aid:aid, type: 1}).then(function(result){
                res.json(result);
            });
        }
    },
    getCmtShort: function(req, res){
        var aid = req.params.aid;
        if(aid) {
            var commentsDAO = new CommentsDAO();
            commentsDAO.search({aid:aid, type: 0}).then(function(result){
                res.json(result);
            });
        }
    },

    // 按日期查询
    searchDate: function(req, res){
        var param = req.params,
            query = {},
            title = '';
        if(param.day) {
            query = {dtime: param.day};
            title = param.day;
        }else if(param.month){
            title = param.month.substr(0,6);
            query = {dmonth: title}

        }else if(param.year){
            title = param.year.substr(0,4);
            query = {dyear: title}
        }
        var historyDAO = new HistoryDAO();
        historyDAO.search(query).then(function(result){
            // res.render('index', {'title': key+'_知乎搜索', 'list': result});
            res.json(result);
        });
        
    },

    // temp列表内容
    list: function(req, res){
        var historyDAO = new HistoryDAO();
        historyDAO.list().then(function(list){
            res.render('list', {'list':list});
        });
    },

    // test页面
    test: function(req, res){
        var data = {
            days: []
        };
        for(var i=1;i<=31;i++){
            data.days[i] = i;
        }
        data.days = data.days.slice(1);
        res.render('test', {'title': '知乎 日报', 'data': data});
    } 


}
module.exports = Home;