/*
 * 文章tag model
 * 
*/
var mongodb = require('../connect');
var Schema = mongodb.mongoose.Schema;
var Promise = require('es6-promise').Promise;

var TagSchema = new Schema({
    aid    : String,
    tags   : [String],
    dtime: String,
    dmonth: String
});

var TagDAO = function(){};
var Tag = mongodb.mongoose.model('Tag', TagSchema);

TagDAO.prototype =  {

    constructor: TagDAO,
    save: function(obj){
        return new Promise(function(resolve, reject){
            var instance = new Tag(obj);
            instance.save(function(err){
                if(err) return reject(err);
                resolve();
            });
        });
    },
    delete: function(aid){
        return new Promise(function(resolve, reject){
            Tag.remove({id: aid}, function(err, data){
                if(err) return reject(err)
                resolve(d);
            });
        });
    },
    search: function(query){
        return new Promise(function(resolve, reject){
            Tag.find(query, function(err, d){
                if(err) return reject(err)
                var data = [];
                if(d.length > 0){
                    for(var i=0,len=d.length;i<len;i++){
                        var re = {
                            aid: d[i].id,
                            tags: d[i].tags,
                            dtime: d[i].dtime,
                            dmonth: d[i].dmonth
                        }
                        data.push(re);
                    }
                }
                resolve(data);
            });
        });
    }
    
};

module.exports = TagDAO;