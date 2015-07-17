var request = require('request');
var Promise = require('es6-promise').Promise;
var $ = require('cheerio');
var zhAPI = require('./../common/api/index');
var HistoryDAO = require('../common/db/models/history');


var Home = {
    // 获取最新内容
    getLatest: function(req,res){
        Promise.all([zhAPI.getStartPic(), zhAPI.getLatest()]).then(function(result){
            // console.log(result);
            var pic = result[0];
            var latest = result[1];
            res.render('index', { 'title': 'Daily', 'pic':pic, 'latest':latest.stories});
        });
        // zhAPI.getLatest().then(function(latest){
        //     console.log(latest);
        // });
    },
    
    // 文章详情
    getArticle: function(req,res){
        var articleId = req.params.id;
        if(articleId) {
            var url = 'http://news-at.zhihu.com/api/4/news/'+articleId;
            request(url, function(err,response,body){
                if(!err) {
                    var article = JSON.parse(body);
                    var content = $(article.body);
                    // console.log(content.text());
                    // console.log(article.body);
                    res.render('article', { 'title': article.title});
                }
            });
        }
        
    },

    // 搜索
    so: function(req, res){
        var key = req.params.key,
            query = {title: new RegExp(key)}; 
        console.log(query);       
        var historyDAO = new HistoryDAO();
        historyDAO.so(query).then(function(result){
            res.render('list', {'title': key+'_知乎搜索', 'list': result});
        });
    },
    // 按日期查询
    soByDate: function(req, res){
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
        historyDAO.so(query).then(function(result){
            // res.render('list', {'title': '知乎日报_' + title, 'list': result});
            console.log(result);
            res.json(result);
            return;
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