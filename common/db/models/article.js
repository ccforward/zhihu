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
    section: Object,
    sectionId: String,
    sectionName: String,
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
    delete: function(aid){
        return new Promise(function(resolve, reject){
            Article.remove({id: aid}, function(err, data){
                if(err) return reject(err)
                resolve(d);
            });
        });
    },
    search: function(query){
        return new Promise(function(resolve, reject){
            Article.find(query, function(err, data){
                if(err) return reject(err)
                var result = [];
                if(data) {
                    for(var i=0,len=data.length;i<len;i++){
                        d = {
                            id: data[i].id,
                            title: data[i].title,
                            body: data[i].body,
                            image: data[i].image,
                            imageSource: data[i].imageSource,
                            shareUrl: data[i].shareUrl,
                            section: data[i].section,
                            sectionId: data[i].sectionId,
                            sectionName: data[i].sectionName,
                            dtime: data[i].dtime,
                            dmonth: data[i].dmonth,
                            dyear: data[i].dyear
                        }
                        result.push(d)
                    }
                } 
                resolve(result);
            });
        });
    },
    
};

module.exports = ArticleDAO;