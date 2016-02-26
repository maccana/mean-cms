var express = require('express');
var router = express.Router();

// Set default route to index of client-side Angular app
router.get('*', function(request, response) {
    response.sendfile('./public/app/index.html');
});

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = router;
