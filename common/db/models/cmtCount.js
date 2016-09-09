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
                err ? reject(err) : resolve();
            });
        });
    },
    search: function(aid){
        return new Promise(function(resolve, reject){
            CmtCount.find({aid: aid}, function(err, data){
                if(err) return reject(err)
                var d = {};
                if(data.length>0){
                    d = {
                        aid: data[0].aid,
                        comments: data[0].comments,
                        longComments: data[0].longComments,
                        shortComments: data[0].shortComments,
                        popularity: data[0].popularity,
                        dtime: data[0].dtime,
                        dmonth: data[0].dmonth,
                        dyear: data[0].year
                    }
                }
                resolve(d);
            });
        });
    }
    
};

module.exports = CmtCountDAO;