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
    popularity: Number
});

var CmtCountDAO = function(){};
var CmtCount = mongodb.mongoose.model('CmtCount', CmtCountSchema);

CmtCountDAO.prototype =  {
    constructor: CmtCountDAO,
    save: function(obj){
        return new Promise(function(resolve, reject){
            var instance = new CmtCount(obj);
            instance.save(function(err){
                resolve && resolve(err);
            });
        });
    }
    
};

module.exports = CmtCountDAO;