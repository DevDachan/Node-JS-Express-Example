var http = require('http');
var db = require('../lib/db.js');
var template = require('../lib/template.js');
var url = require('url');
var qs = require('querystring');
var express = require('express');
var router = express.Router();
var path = require('path');
var shortid = require('shortid');
var bcrypt = require('bcrypt');

module.exports = function(passport){

  router.post('/user_check',
    passport.authenticate('local', {
      successRedirect: '/user/main',
      failureRedirect: '/',
      failureFlash: true,
      successFlash: true
    }));

    router.post('/register', function (request, response) {
      var fmsg = request.flash();
      var feedback = '';
      if (fmsg.error) {
        feedback = fmsg.error[0];
      }
      response.send(template.register_HTML(feedback));
    });

    router.get('/register', function (request, response) {
      var fmsg = request.flash();
      var feedback = '';
      if (fmsg.error) {
        feedback = fmsg.error[0];
      }
      response.send(template.register_HTML(feedback));
    });

    router.post('/register_process', function (request, response) {
        var post = request.body;
        var id = post.id;
        db.query(`SELECT * FROM user WHERE id=?`, [post.id], function(error,temp){
          if(error){
            throw error;
          }
          var pwd = post.pwd;
          var pwd2 = post.pwd2;
          var name = post.name;
          if(temp.length > 0){
            request.flash('error', 'User alredy exists!!');
            response.redirect('/login/register');
          }
          else if(pwd !== pwd2){
            request.flash('error', 'Passwod must same!!');
            response.redirect('/login/register');
          }else{
            bcrypt.hash(pwd, 10, function(err, hash){
              var user = {
                id: id,
                password: hash,
                name: name
              };
              db.query(`INSERT INTO user VALUE(?,?,?)`, [user.id,  user.password, user.name], function(error2, state){
                if(error2){
                  throw error2;
                }
                request.login(user, function(err){
                  return response.redirect('/user/main');
              });
            });
            });
          }
        });
    });

    router.get('/logout', function (request, response) {
      request.logout();
      request.session.save(function () {
        response.redirect('/');
      });
    });

  return router;
}
