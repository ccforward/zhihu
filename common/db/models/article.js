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
                err ? reject(err) : resolve();
            });
        });
    },
    search: function(aid){
        return new Promise(function(resolve, reject){
            Article.find({id: aid}, function(err, data){
                if(err) return reject(err)
                var d = {};
                if(data.length>0){
                    d = {
                        id: data[0].id,
                        title : data[0].title,
                        body  : data[0].body,
                        image : data[0].image,
                        imageSource: data[0].imageSource,
                        shareUrl: data[0].shareUrl,
                        dtime: data[0].dtime,
                        dmonth: data[0].dmonth,
                        dyear: data[0].dyear
                    }
                }
                resolve(d);
            });
        });
    },
    
};

module.exports = ArticleDAO;