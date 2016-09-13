/*
 * 临时记录出错的 aid
 * 长评 1
 * 短评 0
 * 
*/
var mongodb = require('../connect');
var Schema = mongodb.mongoose.Schema;
var Promise = require('es6-promise').Promise;

var TmpSchema = new Schema({
    aid: String,
    dtime: String
});

var TmpDAO = function(){};
var Tmp = mongodb.mongoose.model('Tmp', TmpSchema);

TmpDAO.prototype =  {
    constructor: TmpDAO,
    save: function(obj){
        return new Promise(function(resolve, reject){
            var instance = new Tmp(obj);
            instance.save(function(err){
                if(err) return reject(err);
                resolve();
            });
        });
    },
    search: function(query){
        return new Promise(function(resolve, reject){
            Tmp.find(query, function(err, data){
                if(err) return reject(err)
                var d = {};
                if(data){
                    d = {
                        aid: data.aid,
                        dtime: data.dtime
                    }
                }
                resolve(d);
            });
        });
    }
    
};

module.exports = TmpDAO;