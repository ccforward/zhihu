var Promise = require('es6-promise').Promise;
var HistoryDAO = require('../database/models/history');
var ArticleDAO = require('../database/models/article');
var CmtCountDAO = require('../database/models/cmtCount');
var CommentsDAO = require('../database/models/comments');
var LatestDAO = require('../database/models/latest');
var zhAPI = require('../spider/api/index-promise');
var cheerio = require('cheerio')
var _ = require('lodash')
var URL = require('url')


var cmtCountDAO = new CmtCountDAO();
var latestDAO = new LatestDAO();
var articleDAO = new ArticleDAO();
var commentsDAO = new CommentsDAO();

var Home = {
    index: function(req, res){
        res.render('index');
    },
    // 获取最新内容
    getLatest: function(req, res){
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
            articleDAO.search({id: aid}).then(function(data){
                if(data.length){
                    var result = data[0]
                    //  HTML实体转换 http://www.cnblogs.com/zichi/p/5135636.html
                    // var $ = cheerio.load(result.body, {decodeEntities: false});
                    // $('img').each(function(idx, item){
                    //     $(item).attr('src','http://ccforward.sinaapp.com/api/proxy.php?url=' + $(item).attr('src'))
                    // });
                    // result.body = $.root().html();
                }
                res.json(result)
            });
        }else {
            res.json([])
        }
    },

    getCmtCount: function(req, res){
        var aid = req.params.aid;
        if(aid) {
            cmtCountDAO.search({aid:aid}).then(function(result){
                res.json(result.length ? result[0]: {});
            });
        }
    },
    
    getAPIComments: function(req, res){
        var aid = req.params.aid,
            apiData = [];
        if(aid) {
            zhAPI.getCmtLong(aid)
                .then(function(d){
                    apiData.push(d)
                    return zhAPI.getCmtshort(aid)
                })
                .then(function(d){
                    apiData.push(d)
                    res.json(apiData);
                })
                .catch(function(){
                    res.json([]);
                });
        }else {
            res.json([]);
        }
    },
    getComments: function(req, res){
        var aid = req.params.aid;
        if(aid) {
            commentsDAO.search({aid:aid}).then(function(result){
                res.json(result);
            });
        }else {
            res.json([]);
        }
    },
    getCmtLong: function(req, res){
        var aid = req.params.aid;
        if(aid) {
            commentsDAO.search({aid:aid, type: 1}).then(function(result){
                res.json(result);
            });
        }else {
            res.json([]);
        }
    },
    getCmtShort: function(req, res){
        var aid = req.params.aid;
        if(aid) {
            commentsDAO.search({aid:aid, type: 0}).then(function(result){
                res.json(result);
            });
        }else {
            res.json([]);
        }
    },

    // 按日期查询 history
    searchDate: function(req, res){
        var historyDAO = new HistoryDAO();
        var param = req.params,
            query = {},
            title = '';
        if(param.day) {
            query = {dtime: param.day};
            title = param.day;
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