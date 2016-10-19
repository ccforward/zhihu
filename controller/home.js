var request = require('request');
var Promise = require('es6-promise').Promise;
var zhAPI = require('./../common/api/index-promise');
var HistoryDAO = require('../common/db/models/history');
var ArticleDAO = require('../common/db/models/article');
var CmtCountDAO = require('../common/db/models/cmtCount');
var CommentsDAO = require('../common/db/models/comments');
var LatestDAO = require('../common/db/models/latest');
var cheerio = require('cheerio')
var _ = require('lodash')
var URL = require('url');

var Home = {
    index: function(req, res){
        res.render('index');
    },
    // 获取最新内容
    getLatest: function(req, res){
        var latestDAO = new LatestDAO();
        latestDAO.all().then(function(result){
            if(result.length){
                res.json(result)
            }
        })
    },
    
    // 文章详情
    getArticle: function(req, res){
        var aid = req.params.aid;
        if(aid) {
            var articleDAO = new ArticleDAO();
            articleDAO.search({id: aid}).then(function(data){
                if(data.length){
                    var result = data[0]
                    //  HTML实体转换 http://www.cnblogs.com/zichi/p/5135636.html
                    var $ = cheerio.load(result.body, {decodeEntities: false});
                    $('img').each(function(idx, item){
                        $(item).attr('src','http://ccforward.sinaapp.com/api/proxy.php?url=' + $(item).attr('src'))
                    });
                    result.body = $.root().html();
                }
                res.json(result)
                // if(req.headers.vary == 'pjax'){
                //     res.json(result)
                // }else {
                //     res.render('article', {'data': result, 'title': 'Article'});
                // }
            });
        }else {
            // res.redirect('/index')
        }
    },

    getCmtCount: function(req, res){
        var aid = req.params.aid;
        if(aid) {
            var cmtCountDAO = new CmtCountDAO();
            cmtCountDAO.search({aid:aid}).then(function(result){
                res.json(result.length ? result[0]: {});
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
        var historyDAO = new HistoryDAO();
        var cmtCountDAO = new CmtCountDAO();
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
        cmtCountDAO.search(query).then(function(cmts){
            historyDAO.search(query).then(function(history){
                var result = []
                _.each(history, function(item){
                    _.each(cmts, function(cmt){
                        if(cmt.aid == item.id){
                            item.popularity = cmt.popularity;
                            item.comments = cmt.comments;
                            item.longComments = cmt.longComments;
                            item.shortComments = cmt.shortComments;
                            result.push(item);
                        }
                    })
                });
                res.json(result);
            });
        })
        
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