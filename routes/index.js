var express = require('express');
var router = express.Router();
var path = require('path');

// Set default route to index of client-side Angular app
router.get("/", function(req, res)
{
    //res.sendFile("/public/app/index.html");
    res.sendFile(path.join(__dirname, '../public/app', 'index.html'));
});

router.get('/views/:name', function (req, res) {
  var name = req.params.name;
  console.log("Patial loading:", name);

  // NOTE: _dirname is ends '..../mean-cms/routes'
  // '../public/app/views' goes back up a directory to find angular templates
  res.render(path.join(__dirname, '../public/app/views/' + name));

});

module.exports = router;
