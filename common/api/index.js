// var Promise = require('es6-promise').Promise;
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

module.exports = {
    getStartPic: function(cb){
        var url = API.startPic;
        request(url, function(err, res, body){
            if(cb){
                cb(err, JSON.parse(body));
            }else{
                return err || JSON.parse(body);
            }
        });    
    },
    // 最新内容
    getLatest: function(cb){
        var url = API.latest;
        request({
            method: 'GET',
            uri: url,
            headers: {'Authorization': config.auth }
        },function(err, response, body){
            if(cb){
                cb(err, JSON.parse(body));
            }else{
                return err || JSON.parse(body);
            }
        });        
            
    },
    // 文章详情
    getArticle: function(articleId, cb){
        if(articleId) {
            var url = API.article + articleId;
            request({
                method: 'GET',
                uri: url,
                headers: { 'Authorization': config.auth }
            }, function(err, response, body){
                if(cb){
                    cb(err, JSON.parse(body));
                }else{
                    return err || JSON.parse(body);
                }
            });
        }else {
            if(cb){
                cb(null);
            }else {
                return null;
            }
        }
    },
    // 评论数点赞数
    getCmtcount: function(articleId, cb){
        if(articleId){
            var url = API.cmtCount + articleId;
            request({
                method: 'GET',
                uri: url,
                headers: { 'Authorization': config.auth }
            }, function(err, response, body){
                if(cb){
                    cb(err, JSON.parse(body));
                }else{
                    return err || JSON.parse(body);
                }
            });
        }else {
            if(cb){
                cb(null);
            }else {
                return null;
            }
        }
    },
    // 长评论
    getCmtLong: function(articleId, cb){
        if(articleId){
            var url = API.cmtLong + articleId + '/long-comments';
            request({
                method: 'GET',
                uri: url,
                headers: { 'Authorization': config.auth }
            }, function(err, response, body){
                if(cb){
                    cb(err, JSON.parse(body));
                }else{
                    return err || JSON.parse(body);
                }
            });
        }else {
            if(cb){
                cb(null);
            }else {
                return null;
            }
        }
    },
    // 短评论
    getCmtshort: function(articleId, cb){
        if(articleId){
            var url = API.cmtShort + articleId + '/short-comments';
            request({
                method: 'GET',
                uri: url,
                headers: { 'Authorization': config.auth }
            }, function(err, response, body){
                if(cb){
                    cb(err, JSON.parse(body));
                }else{
                    return err || JSON.parse(body);
                }
            });
        }else {
            if(cb){
                cb(null);
            }else {
                return null;
            }
        }
    },
    getHistory: function (date, cb){
        if(date){
            var url = API.history + date;
            request({
                method: 'GET',
                uri: url,
                headers: { 'Authorization': config.auth }
            }, function (err, response, body){
                console.log('body')
                return body;
                if(cb){
                    cb(err, JSON.parse(body));
                }else{
                    return err || JSON.parse(body);
                }
            });
        }else {
            if(cb){
                cb(null);
            }else {
                return null;
            }
        }
    }
}