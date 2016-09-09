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
    aid: String,
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
                err ? reject(err) : resolve();
            });
        });
    },
    search: function(cmt){
        return new Promise(function(resolve, reject){
            Comments.find({aid: cmt.aid, type: cmt.type}, function(err, data){
                if(err) return reject(err)
                var d = {};
                if(data.length>0){
                    d = {
                        aid: data[0].aid,
                        comments: data[0].comments,
                        type: data[0].type,
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

module.exports = CommentsDAO;