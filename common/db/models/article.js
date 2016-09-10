/*
 * 文章详情 model
 * 
*/
var mongodb = require('../connect');
var Schema = mongodb.mongoose.Schema;
var Promise = require('es6-promise').Promise;

var ArticleSchema = new Schema({
    id    : String,
    title : String,
    body  : String,
    image : String,
    css   : [String],
    js    : [String],
    imageSource: String,
    shareUrl: String,
    dtime: String,
    dmonth: String,
    dyear: String
});

var ArticleDAO = function(){};
var Article = mongodb.mongoose.model('Article', ArticleSchema);

ArticleDAO.prototype =  {

    constructor: ArticleDAO,
    save: function(obj){
        return new Promise(function(resolve, reject){
            var instance = new Article(obj);
            instance.save(function(err){
                if(err) return reject(err);
                resolve();
            });
        });
    },
    search: function(aid){
        return new Promise(function(resolve, reject){
            Article.findOne({id: aid}, function(err, data){
                if(err) return reject(err)
                var d = {};
                if(data) {
                    d = {
                        id: data.id,
                        title : data.title,
                        body  : data.body,
                        image : data.image,
                        imageSource: data.imageSource,
                        shareUrl: data.shareUrl,
                        dtime: data.dtime,
                        dmonth: data.dmonth,
                        dyear: data.dyear
                    }
                } 
                resolve(d);
            });
        });
    },
    
};

module.exports = ArticleDAO;