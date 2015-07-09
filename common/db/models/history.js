/*
 * 历史数据 model
 * 
*/
var mongodb = require('../connect');
var Schema = mongodb.mongoose.Schema;
var Promise = require('es6-promise').Promise;

var HistorySchema = new Schema({
    id: String,
    title: String,
    image: String,
    theme: String,
    dtime: String,
    dmonth: String,
    dyear: String
});

var HistoryDAO = function(){};
var History = mongodb.mongoose.model('History', HistorySchema);

HistoryDAO.prototype =  {

    constructor: HistoryDAO,
    save: function(obj){
        return new Promise(function(resolve, reject){
            var instance = new History(obj);
            instance.save(function(err){
                resolve && resolve(err);
            });
        });
    },
    so: function(query){
        return new Promise(function(resolve, reject){
            History.find(query, function(err, d){
                resolve && resolve(d);
            });
        });
    },
    list: function(){
        return new Promise(function(resolve, reject){
            History.find(function(err, d){
                resolve && resolve(d);
            });
            
        });
    }
    
};

module.exports = HistoryDAO;