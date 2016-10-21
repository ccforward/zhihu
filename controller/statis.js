var StatisDAO = require('../common/db/models/statis'),
    HistoryDAO = require('../common/db/models/history');

var statisDAO = new StatisDAO();
var historyDAO = new HistoryDAO();

module.exports = {
    index: function(req, res){
        res.render('statis', {title: '数据统计'});
    },
    statisMonth: function(req, res){
        res.render('statis-month', {title: '数据统计-'+req.params.dmonth, month: req.params.dmonth});
    },

    // =========== API ===========
    // 按日期查询
    searchDate: function(req, res){
        
        var param = req.params,
            query = {};
        if(param.dmonth) {
            query = {dmonth: param.dmonth};
        } else if(param.dyear){
            query = {dyear: param.dyear};
        } else {
            res.json([]);
        }
        statisDAO.search(query).then(function(data){
            res.json(data)
        }).catch(function(){
            res.json([])
        });
    },
    searchArticles: function(req, res){
        var param = req.params,
            query = {}
        if(param.aids) {
            query = {id: {$in: param.aids.split(',')}};
            historyDAO.search(query).then(function(data){
                res.json(data)
            }).catch(function(err){
                res.json([])
            });   
        }else {
            res.json([]);
        }
    },


}
