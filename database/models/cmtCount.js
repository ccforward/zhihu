/*
 * 文章点赞评论数 model
 * 
*/
var mongodb = require('../connect');
var Schema = mongodb.mongoose.Schema;
var Promise = require('es6-promise').Promise;

var CmtCountSchema = new Schema({
    aid: { type: String, index: true }, // 索引-单篇文章用
    comments: Number,
    longComments: Number,
    shortComments: Number,
    popularity: Number,
    dtime: { type: String, index: true }, // 索引-历史记录用
    dmonth: { type: String, index: true }, // 索引-统计用
    dyear: String
});

var CmtCountDAO = function(){};
var CmtCount = mongodb.mongoose.model('CmtCount', CmtCountSchema);

CmtCountDAO.prototype =  {
    constructor: CmtCountDAO,
    save: function(obj){
        return new Promise(function(resolve, reject){
            var instance = new CmtCount(obj);
            instance.save(function(err){
                if(err) return reject(err);
                resolve();
            });
        });
    },
    delete: function(query){
        return new Promise(function(resolve, reject){
            CmtCount.remove(query, function(err, data){
                if(err) return reject(err)
                resolve(data);
            });
        });
    },
    search: function(query){
        return new Promise(function(resolve, reject){
            CmtCount.find(query, function(err, data){
                if(err) return reject(err)
                var result = [];
                if(data){
                    for(var i=0,len=data.length;i<len;i++){
                        var d = {
                            aid: data[i].aid,
                            comments: data[i].comments,
                            longComments: data[i].longComments,
                            shortComments: data[i].shortComments,
                            popularity: data[i].popularity,
                            dtime: data[i].dtime,
                            dmonth: data[i].dmonth,
                            dyear: data[i].dyear
                        }
                        result.push(d);
                    }
                }
                resolve(result);
            });
        });
    }
    
};

module.exports = CmtCountDAO;