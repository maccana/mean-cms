var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Page= require('../models/page.js');
var adminUser= require('../models/admin-users.js');

/* User Routes. */

router.get('/', function(req, res) {
  res.send('Welcome to the API zone');
});

router.get('/pages', function(request, response) {

        return Page.find(function(err, pages) {
            if (!err) {
                return response.send(pages);
            } else {
                return response.send(500, err);
            }
        });
    });

router.post('/pages/add', function(request, response) {
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

    router.get('/pages/admin-details/:id', function(request, response) {
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

    router.get('/pages/admin-details/:id', function(request, response) {
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

    router.get('/pages/delete/:id', function(request, response) {
        var id = request.params.id;
        Page.remove({
            _id: id
        }, function(err) {
            return console.log(err);
        });
        return response.send('Page id- ' + id + ' has been deleted');
    });



module.exports = router;
