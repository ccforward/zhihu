/*
 * 统计 model
 * 
*/
var mongodb = require('../connect');
var Schema = mongodb.mongoose.Schema;
var Promise = require('es6-promise').Promise;

var StatisSchema = new Schema({
    type   : String,   // star(点赞数)  comments(评论数)
    sum    : Number, // 总和
    count  : Array, // 前10点赞、评论数值
    aids   : Array,
    tags   : Array, // 前10文章的关键词 10个
    desc   : String, // 分析后的可以自己添加的描述数据
    dmonth : { type: String, index: true },
    dyear  : String
});

var StatisDAO = function(){};
var Statis = mongodb.mongoose.model('Statis', StatisSchema);

StatisDAO.prototype =  {

    constructor: StatisDAO,
    save: function(obj){
        return new Promise(function(resolve, reject){
            var instance = new Statis(obj);
            instance.save(function(err){
                if(err) return reject(err);
                resolve();
            });
        });
    },
    count: function(query){
        return new Promise(function(resolve, reject){
            Statis.count(query, function(err, d){
                return resolve(d)
            })
        });
    },
    search: function(query){
        return new Promise(function(resolve, reject){
            Statis.find(query, function(err, data){
                if(err) return reject(err)
                var result = [];
                if(data) {
                    for(var i=0,len=data.length;i<len;i++){
                        d = {
                            type: data[i].type,
                            sum: data[i].sum,
                            count: data[i].count,
                            aids: data[i].aids,
                            tags: data[i].tags,
                            // desc: data[i].desc,
                            dmonth: data[i].dmonth
                        }
                        result.push(d)
                    }
                } 
                resolve(result);
            });
        });
    },
    
};

module.exports = StatisDAO;