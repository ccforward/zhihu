/*
 * 文章详情 model
 * 
*/
var mongodb = require('../connect');
var Schema = mongodb.mongoose.Schema;
var Promise = require('es6-promise').Promise;

var ArticleExtraSchema = new Schema({
    id    : String,
    title : String,
    theme : Number,
    body  : String,
    image : String,
    css   : [String],
    js    : [String],
    dtime : Date,
    image_source: String
});

var ArticleDAO = function(){};
var Article = mongodb.mongoose.model('Article', ArticleSchema);

ArticleDAO.prototype =  {

    constructor: ArticleDAO,
    save: function(obj){
        return new Promise(function(resolve, reject){
            var instance = new Article(obj);
            instance.save(function(err){
                resolve && resolve(err);
            });
        });
    }
    
};

module.exports = ArticleDAO;