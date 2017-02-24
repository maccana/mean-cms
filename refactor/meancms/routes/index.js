var express = require('express');
var router = express.Router();
var Page = require('../models/page.js');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// GET a single page by URL
router.get('/:url', function(request, response) {
    var url = request.params.url;
    Page.findOne({
        url: url
    }, function(err, page) {
        if (err)
            return console.log(err);
        return response.send(page);
    });
});
router.get('*', function(request, response) {
    response.sendfile('./public/index.html');
});
module.exports = router;
