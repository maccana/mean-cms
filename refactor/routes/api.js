var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Page = require('../models/page.js');
var adminUser = require('../models/admin-users.js');
var bcrypt = require('bcrypt-nodejs');

function sessionCheck(request,response,next){
  console.log('sessionCheck MW called...  ');
    if(request.session.user) {
      console.log('USER IN SCHECK ', request.session.user);
      next()
    }
      else {response.send(401,'authorization failed');}
}

/* API Routes. */

router.get('/', function(req, res) {
  res.send('Welcome to the API zone');
});

// GET all pages
router.get('/pages', function(request, response) {

        return Page.find(function(err, pages) {
            if (!err) {
                return response.send(pages);
            } else {
                return response.send(500, err);
            }
        });
});

// GET a single page by id
router.get('/pages/:id', function(request, response) {
    var id = request.params.id;
    Page.findOne({
        _id: id
    }, function(err, page) {
        if (err)
            return console.log(err);
        return response.send(page);
    });
});

router.get('/pages/admin-details/:id', sessionCheck, function(request, response) {
    var id = request.params.id;
    Page.findOne({
        _id: id
    }, function(err, page) {
        if (err)
            return console.log(err);
        return response.send(page);
    });
});

router.get('/pages/details/:url', function(request, response) {
    var url = request.params.url;
    Page.findOne({
        url: url
    }, function(err, page) {
        if (err)
            return console.log(err);
        return response.send(page);
    });
});

// POST a new page -> /pages
// {"title":"Blog", "url":"/blog", "content": "Blog Stuff", "menuIndex": 4}
router.post('/pages/add', sessionCheck, function(request, response) {
  console.log('page add called...');
    var page = new Page({
        title: request.body.title,
        url: request.body.url,
        content: request.body.content,
        menuIndex: request.body.menuIndex,
        date: new Date(Date.now())
    });

    page.save(function(err) {
        if (!err) {
            return response.send(200, page);

        } else {
            return response.send(500,err);
        }
    });
});
// CREATE new page
// Should maybe be modified /pages/:id - modified from '/pages/add/:id'
// Logic behind original URL is to share one form for adding a new pages
// or editing an exisiting one. If the page is a new one, then the :id
// of '0' was passed
router.post('/pages/update', sessionCheck, function(request, response) {
    var id = request.body._id;
    // var id = request.params.id; // For CRUD testing

    Page.update({
        _id: id
    }, {
        $set: {
            title: request.body.title,
            url: request.body.url,
            content: request.body.content,
            menuIndex: request.body.menuIndex,
            date: new Date(Date.now())
        }
    }).exec();
    response.send("Page updated");
});

// DELETE Page - modified from '/pages/delete/:id'
router.delete('/pages/:id', sessionCheck, function(request, response) {
    // var id = request.body._id;
    var id = request.params.id; // For CRUD testing

    Page.remove({
        _id: id
    }, function(err) {
        return console.log(err);
    });
    return response.send('Page id- ' + id + ' has been deleted');
});

router.post('/add-user', function(request, response) {
    var salt, hash, password;
    password = request.body.password;
    salt = bcrypt.genSaltSync(10);
    hash = bcrypt.hashSync(password, salt);

    var AdminUser = new adminUser({
        username: request.body.username,
        password: hash
    });
    AdminUser.save(function(err) {
        if (!err) {
            return response.send('Admin User successfully created');

        } else {
            return response.send(err);
        }
    });
});

router.post('/login', function(request, response) {
  console.log('loggin...');
  var username = request.body.username;
  var password = request.body.password;

  adminUser.findOne({
    username: username
  }, function(err, data) {
    if (err | data === null) {
      return response.send(401, "User Doesn't exist");
    } else {
      var usr = data;
      request.session.user = usr;
      console.log('sessionzz ', request.session.user);

      if (username == usr.username && bcrypt.compareSync(password, usr.password)) {

        request.session.regenerate(function() {
          request.session.user = username;
          return response.send(username);

        });
      } else {
        return response.send(401, "Bad Username or Password");
      }
    }
  });
});

router.get('/logout', function(request, response) {

    if(request.session){
      console.log('req sesh....', request.session.user);
      request.session.destroy(function() {
        // console.log('sesh destroy....', request.session.user);
        // return response.sendStatus(401).send('User logged out ok!');
          return response.status(200).send('User logged out');
      });
    } else {
      res.send('cannot destroy session', 500);
    }

});

module.exports = router;
