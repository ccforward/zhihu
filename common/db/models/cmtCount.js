/*
 * 文章点赞评论数 model
 * 
*/
var mongodb = require('../connect');
var Schema = mongodb.mongoose.Schema;
var Promise = require('es6-promise').Promise;

var CmtCountSchema = new Schema({
    aid: String,
    comments: Number,
    longComments: Number,
    shortComments: Number,
    popularity: Number,
    dtime: String,
    dmonth: String,
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
    delete: function(aid){
        return new Promise(function(resolve, reject){
            CmtCount.remove({id: aid}, function(err, data){
                if(err) return reject(err)
                resolve(d);
            });
        });
    },
    search: function(aid){
        return new Promise(function(resolve, reject){
            CmtCount.findOne({aid: aid}, function(err, data){
                if(err) return reject(err)
                var d = {};
                if(data){
                    d = {
                        aid: data.aid,
                        comments: data.comments,
                        longComments: data.longComments,
                        shortComments: data.shortComments,
                        popularity: data.popularity,
                        dtime: data.dtime,
                        dmonth: data.dmonth,
                        dyear: data.year
                    }
                }
                resolve(d);
            });
        });
    }
    
};

module.exports = CmtCountDAO;