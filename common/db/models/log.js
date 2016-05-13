/*
 * 请求日志 model
 * 
*/
var mongodb = require('../connect');
var Schema = mongodb.mongoose.Schema;
var Promise = require('es6-promise').Promise;

var LogSchema = new Schema({
    id: String,
    err: String,
    date: String,
    msg: String
});


var LogDAO = function(){};
var Log = mongodb.mongoose.model('Log', LogSchema);

LogDAO.prototype =  {
    constructor: LogDAO,
    save: function(obj){
        return new Promise(function(resolve, reject){
            console.log(obj)
            var instance = new Log(obj);
            console.log(instance.save());
            return;
            instance.save(function(err){
                resolve && resolve(err);
            });
        });
    }
    
};

module.exports = LogDAO;