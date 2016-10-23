var _ = require('lodash');
var StatisDAO = require('../common/db/models/statis'),
    HistoryDAO = require('../common/db/models/history');

var statisDAO = new StatisDAO();
var historyDAO = new HistoryDAO();

var dealYearData = function(data) {
    var starArr = [],
        cmtArr = [],
        monthArr = [];
    data = _.sortBy(data, function(o) { 
        return o.dmonth;
    });
    for(var i=0,len=data.length;i<len;i++){
        if(data[i].type == 'star'){
            starArr.push(data[i])
            monthArr.push(data[i].dmonth)
        }else {
            cmtArr.push(data[i])
        }
    }
    return [{
        star: starArr,
        cmt: cmtArr,
        month: monthArr
    }]
}
module.exports = {
    index: function(req, res){
        res.render('statis', {title: '数据统计'});
    },
    statisMonth: function(req, res){
        res.render('statis-month', {title: req.params.dmonth+'-数据统计', month: req.params.dmonth});
    },
    statisYear: function(req, res){
        res.render('statis-year', {title: req.params.dyear+'-数据统计', year: req.params.dyear});
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
            if(param.dyear){
                data = dealYearData(data)
            }
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
    }
}
