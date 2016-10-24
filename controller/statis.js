var _ = require('lodash');
var StatisDAO = require('../common/db/models/statis'),
    HistoryDAO = require('../common/db/models/history');

var statisDAO = new StatisDAO();
var historyDAO = new HistoryDAO();

var dealYearData = function(data) {
    var starArr = [],
        cmtArr = [],
        monthArr = [],
        aids = [],
        sTenK = [],
        sTwentyK = [],
        cOneK = [];

    data = _.sortBy(data, function(o) { 
        return o.dmonth;
    });
    for(var i=0,len=data.length;i<len;i++){
        if(data[i].type == 'star'){
            starArr.push(data[i]);
            monthArr.push(data[i].dmonth);

            for(var m=0,mLen=data[i].count.length; m<mLen; m++){
                var count = data[i].count[m];
                var idx = _.indexOf(data[i].count, count);
                if(count > 9999 && count < 20000){
                    sTenK.push({
                        count: count,
                        aid: data[i].aids[idx]
                    });
                    aids.push(data[i].aids[idx])
                }else if(count > 19999){
                    sTwentyK.push({
                        count: count,
                        aid: data[i].aids[idx]
                    });
                    aids.push(data[i].aids[idx])
                }
            }
        }else {
            cmtArr.push(data[i])
            for(var x=0,xLen=data[i].count.length; x<xLen; x++){
                var count = data[i].count[x];
                var idx = _.indexOf(data[i].count, count);
                if(count > 999){
                    cOneK.push({
                        count: count,
                        aid: data[i].aids[idx]
                    });
                    aids.push(data[i].aids[idx])
                }
            }
        }
    }

    return {
        data: {
            star: starArr,
            cmt: cmtArr,
            month: monthArr
        },
        aids: aids,
        sTenK: _.flattenDeep(sTenK),
        sTwentyK: _.flattenDeep(sTwentyK),
        cOneK: _.flattenDeep(cOneK)
    }
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
        statisDAO.search(query).then(function(d){
            if(param.dyear){
                var data = dealYearData(d);
                historyDAO.search({id: {$in: data.aids}}).then(function(articles){
                    var arts = {}
                    for(var x=0,len=articles.length; x<len; x++){
                        arts[articles[x].id] = articles[x]
                    }
                    res.json({
                        data: data.data,
                        articles: arts,
                        sTenK: data.sTenK,
                        sTwentyK: data.sTwentyK,
                        cOneK: data.cOneK
                    })
                }).catch(function(){
                    res.json({})
                })   
            }
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
