// var http = require('http');
// var url = require('url');
var request = require('request');
var jade = require('jade');
var jQuery = require('jQuery');

var dailyAPI = {
    getStart: function(req,res){

        // 启动图品 尺寸： 320*432 480*728 720*1184 1080*1776
        // request('http://news-at.zhihu.com/api/4/start-image/720*1184',function(err,response,body){
        //     if(!err){
        //         var pic = JSON.parse(body);
        //         pic.img = 'http://gtms03.alicdn.com/tps/i3/TB117YzHpXXXXXLXXXXWZMJJXXX-720-1280.jpg';
        //         res.render('index', { 'title': 'Daily', 'pic': pic});
        //     }else {
        //         console.log(err);
        //     }
        // });

        // 最新内容
        // http://news-at.zhihu.com/api/4/news/latest
        request('http://news-at.zhihu.com/api/4/news/latest', function(err, response, body){
            if(!err){
                var latest = JSON.parse(body);
                var pic = {};
                pic.text = 'author @ 2015';
                pic.img = 'http://gtms03.alicdn.com/tps/i3/TB117YzHpXXXXXLXXXXWZMJJXXX-720-1280.jpg';
                // console.log(latest.stories);
                res.render('index', { 'title': 'Daily', 'pic': pic, 'latest':latest.stories});
            }else {

            }
        });
    },
    getArticle: function(req,res){
        var $ = jQuery;
        var articleId = req.params.id;
        if(articleId) {
            var url = 'http://news-at.zhihu.com/api/4/news/'+articleId;
            request(url, function(err,response,body){
                if(!err) {
                    var article = JSON.parse(body);
                    var content = window.$(article.body);
                    console.log(content);
                    // res.render('article', { 'article': article});
                }
            })
        }else {

        }
        
    }

}
module.exports = dailyAPI;