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
    type: String,
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
                if(err) return reject(err);
                resolve();
            });
        });
    },
    delete: function(query){
        return new Promise(function(resolve, reject){
            History.remove(query, function(err, data){
                if(err) return reject(err)
                resolve(data);
            });
        });
    },
    count: function(query){
        return new Promise(function(resolve, reject){
            History.count(query, function(err, d){
                return resolve(d)
            })
        });
    },
    search: function(query){
        return new Promise(function(resolve, reject){
            History.find(query, function(err, d){
                if(err) return reject(err)
                var data = [];
                if(d.length > 0){
                    for(var i=0,len=d.length;i<len;i++){
                        var re = {
                            id: d[i].id,
                            title: d[i].title,
                            image: d[i].image,
                            dtime: d[i].dtime
                        }
                        data.push(re);
                    }
                }
                resolve(data);
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