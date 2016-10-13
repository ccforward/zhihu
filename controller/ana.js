var ana = require('../analyze')
var URL = require('url');

module.exports = {
    index: function(req, res){
        ana.count()
        res.render('ana');
    },
    
}
