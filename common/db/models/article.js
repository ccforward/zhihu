var mongodb = require('../connect');
var Schema = mongodb.mongoose.Schema;
var Promise = require('es6-promise').Promise;

var ArticleSchema = new Schema({
    title: String,
    body: String,
    image: String,
    image_source: String,
    css: [String],
    js: [String],
    dtime: Date
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