var ArticleDAO = require('../db/models/article');
var zhAPI = require('../api/index');



var dao = new ArticleDAO();

console.log(dao.save(obj));
// articleDAO.save(obj);