var Promise = require('es6-promise').Promise;
var _ = require('lodash');


var ArticleDAO = require('../common/db/models/article');
var HistoryDAO = require('../common/db/models/history');
var CmtCountDAO = require('../common/db/models/cmtCount');
var CommentsDAO = require('../common/db/models/comments');
var LatestDAO = require('../common/db/models/latest');
var TmpDAO = require('../common/db/models/tmp');

var historyDAO = new HistoryDAO(),
    articleDAO = new ArticleDAO(),
    cmtCountDAO = new CmtCountDAO(),
    commentsDAO = new CommentsDAO(),
    tmpDAO = new TmpDAO();


var Analyze = {
    count: function(){
        cmtCountDAO.search({'dmonth':'201609'})
            .then(function(d){
                var popular = _.maxBy(d, function(o){
                    return o.popularity
                })
                var popularSum = _.sumBy(d, function(o){
                    return o.popularity
                })
                var comment = _.maxBy(d, function(o){
                    return o.comments
                })
                var commentSum = _.sumBy(d, function(o){
                    return o.comments
                })

                var sortPop = _.orderBy(d, ['popularity'],['desc'])
                var sortComment = _.orderBy(d, ['comments'],['desc'])
                // console.log(popular)
                // console.log(popularSum)
                _.slice(sortComment, 0, 5)
                console.log(sortComment.length)
            })
    }
}


module.exports = Analyze;