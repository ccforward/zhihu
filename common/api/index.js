var Promise = require('es6-promise').Promise;
var request = require('request');
var config = require('../../config');

var API = {
    'startPic'  : 'http://news-at.zhihu.com/api/4/start-image/720*1184',
    'latest'    : 'http://news-at.zhihu.com/api/4/news/latest',
    'article'   : 'http://news-at.zhihu.com/api/4/news/',
    'history'   : 'http://news.at.zhihu.com/api/4/news/before/',
    'cmtCount'  : 'http://news-at.zhihu.com/api/4/story-extra/',
    'cmtLong'   : 'http://news-at.zhihu.com/api/4/story/',
    'cmtShort'  : 'http://news-at.zhihu.com/api/4/story/'
}

var data = {
    getStartPic: function(){
        var url = API.startPic;
        return new Promise(function(resolve, reject){
            request(url ,function(err,response,body){
                var pic = null;
                if(!err){
                    var pic = JSON.parse(body);
                    pic.img = 'http://gw.alicdn.com/tps/i3/TB117YzHpXXXXXLXXXXWZMJJXXX-720-1280.jpg';
                }
                resolve(pic);
            });    
        });
    },
    // 最新内容
    getLatest: function(){
        var url = API.latest;
        return new Promise(function(resolve, reject){
            request({
                method: 'GET',
                uri: url,
                headers: {'Authorization': config.auth }
            },function(err, response, body){
                var latest = null;
                if(!err){
                    var latest = JSON.parse(body);
                }
                resolve(latest);
            });        
            
        });
    },
    // 文章详情
    getArticle: function(articleId){
        return new Promise(function(resolve, reject){
            if(articleId) {
                var url = API.article + articleId;
                request({
                    method: 'GET',
                    uri: url,
                    headers: { 'Authorization': config.auth }
                }, function(err, response, body){
                    var article = err ? null : JSON.parse(body);
                    resolve(article);
                });
            }else {
                resolve(null);
            }
        })
    },
    // 评论数点赞数
    getCmtcount: function(articleId){
        return new Promise(function(resolve, reject){
            if(articleId){
                var url = API.cmtCount + articleId;
                request({
                    method: 'GET',
                    uri: url,
                    headers: { 'Authorization': config.auth }
                }, function(err, response, body){
                    var count = err ? null : JSON.parse(body);
                    resolve(count);
                });
            }else {
                resolve(null);
            }

        });               
    },
    // 长评论
    getCmtLong: function(articleId){
        return new Promise(function(resolve, reject){
            if(articleId){
                var url = API.cmtLong + articleId + '/long-comments';
                request({
                    method: 'GET',
                    uri: url,
                    headers: { 'Authorization': config.auth }
                }, function(err, response, body){
                    var comments = err ? null : JSON.parse(body);
                    resolve(comments);
                });
            }else {
                resolve(null);
            }

        });               
    },
    // 短评论
    getCmtshort: function(articleId){
        return new Promise(function(resolve, reject){
            if(articleId){
                var url = API.cmtShort + articleId + '/short-comments';
                request({
                    method: 'GET',
                    uri: url,
                    headers: { 'Authorization': config.auth }
                }, function(err, response, body){
                    var comments = err ? null : JSON.parse(body);
                    resolve(comments);
                });
            }else {
                resolve(null);
            }

        });               
    },
    getHistory: function(date){
        return new Promise(function(resolve, reject){
            if(date){
                var url = API.history + date;
                request({
                    method: 'GET',
                    uri: url,
                    headers: { 'Authorization': config.auth }
                }, function(err, response, body){
                    var history = err ? null : JSON.parse(body);
                    resolve(history);
                });
            }else {
                resolve(null);
            }

        });
    }
}

module.exports = data;