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
    aid: { type: [String], index: true },
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
    search: function(cmt){
        return new Promise(function(resolve, reject){
            Comments.findOne({aid: cmt.aid, type: cmt.type}, function(err, data){
                if(err) return reject(err)
                var d = {};
                if(data){
                    d = {
                        aid: data.aid,
                        comments: data.comments,
                        type: data.type,
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

module.exports = CommentsDAO;