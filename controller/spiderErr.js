var request = require('request');
var Promise = require('es6-promise').Promise;
var Spider = require('../common/util/spider');
var TmpDAO = require('../common/db/models/tmp');


var Tmp = {
    // 爬虫错误列表
    list: function(req, res){
        var tmpDAO = new TmpDAO();
        tmpDAO.list().then(function(list){
            var data = [];
            for(var i=0,length=list.length;i<length;i++){
                var err = {
                    aid: list[i].aid || 0,
                    dtime: list[i].dtime || 0
                }
                data.push(err)
            }
            res.render('spider-err', {'data': data});
        });
    },
    // fix错误 重新爬 dtime 数据
    clear: function(req, res){
        var dtime = req.params.dtime;
        Spider.dayRefresh(dtime)
            .then(function(){
                res.json(dtime + ' refresh over');
            })
    }



}
module.exports = Tmp;