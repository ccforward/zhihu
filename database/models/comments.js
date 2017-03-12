/*
 * 文章长评 短评
 * 长评 1
 * 短评 0
 * 
*/
var mongodb = require('../connect');
var Schema = mongodb.mongoose.Schema;
var Promise = require('es6-promise').Promise;

var CommentsSchema = new Schema({
    aid: { type: String, index: true },
    comments: Array,
    type: Number,
    dtime: String,
    dmonth: String,
    dyear: String
});

var CommentsDAO = function(){};
var Comments = mongodb.mongoose.model('Comments', CommentsSchema);

CommentsDAO.prototype =  {
    constructor: CommentsDAO,
    save: function(obj){
        return new Promise(function(resolve, reject){
            var instance = new Comments(obj);
            instance.save(function(err){
                if(err) return reject(err);
                resolve();
            });
        });
    },
    delete: function(query){
        return new Promise(function(resolve, reject){
            Comments.remove(query, function(err, data){
                if(err) return reject(err)
                resolve(data);
            });
        });
    },
    search: function(query){
        return new Promise(function(resolve, reject){
            Comments.find(query, function(err, data){
                if(err) return reject(err)
                var result = [];
                if(data.length){
                    for(var i=0,len=data.length;i<len;i++){
                        var d = {
                            aid: data[i].aid,
                            comments: data[i].comments,
                            type: data[i].type,
                            // dtime: data[i].dtime,
                            // dmonth: data[i].dmonth,
                            // dyear: data[i].year
                        }
                        result.push(d)
                    }
                }
                resolve(result);
            });
        });
    }
    
};

module.exports = CommentsDAO;