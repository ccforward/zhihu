// 通过API 获取数据
var Promise = require('es6-promise').Promise;
var request = require('request');
var config = require('../../config');

var API = {
    'startPic'  : 'http://news-at.zhihu.com/api/4/start-image/720*1184',
    'latest'    : 'http://news-at.zhihu.com/api/4/news/latest',
    'article'   : 'http://news-at.zhihu.com/api/4/news/',
    'history'   : 'http://news.at.zhihu.com/api/4/news/before/',
    'cmtCount'  : 'http://news-at.zhihu.com/api/4/story-extra/'
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
                headers:{
                    'Authorization': config.auth
                }
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
        if(articleId) {
            var url = API.article + articleId;
            request(url, function(err, response, body){
                if(!err) {
                    var article = JSON.parse(body);
                    return article;
                }
            })
        }else {
            return null;
        }
    },
    // 评论数点赞数
    getCmtcount: function(articleId){
        return new Promise(function(resolve, reject){
            if(articleId){
                var url = API.cmtCount + articleId;
                request({
                    method: 'GET',
                    uri: url,
                    headers:{
                        'Authorization': config.auth
                    }
                }, function(err, response, body){
                    var count = null;
                    if(!err){
                        count = JSON.parse(body);
                    }
                    resolve(count);
                });
            }else {
                console.log('null')
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
                    headers:{
                        'Authorization': config.auth
                    }
                }, function(err, response, body){
                    var history = null;
                    if(!err){
                        history = JSON.parse(body);
                    }
                    resolve(history);
                });
            }else {
                resolve(null);
            }

        });
    }
}

module.exports = data;