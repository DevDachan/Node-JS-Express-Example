const express = require('express');
var fs = require('fs');
var app = express();
var template = require('../lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');
var bodyParser = require('body-parser');
var db = require('../lib/db.js');
var bcrypt = require('bcrypt');
var router = express.Router();



router.get('/main', function (request, response) {
  var fmsg = request.flash();
  var feedback = '';
  if (fmsg.error) {
    feedback = fmsg.error[0];
  }

  db.query(`SELECT * FROM user_room JOIN room USING(room_id) WHERE user_id = ?`, [request.user.id],function(error, user_room){
    if(error){
      throw error;
      }
      db.query(`SELECT * FROM time_table WHERE user_id=?`,[request.user.id], function(error2,user){
        var user_time = new Array(7);
        for(var i = 0; i < 7 ; i++){
          user_time[i] = new Array(7);
        }

        var day = ['월','화','수','목','금','토','일' ];

        for(var i = 0; i<7; i++){
          for(var k = 0; k<7; k++){
            user_time[i][k] = " ";
          }
        }

        for(var i = 0; i< user.length; i++){
          user_time[day.indexOf(user[i].day)][user[i].time-1] = user[i].title;
        }
        response.send(template.main_HTML(request,user_room,feedback, user_time));

        });
      });
});





router.post('/my_profile', function (request, response) {
    var fmsg = request.flash();
    var feedback = '';
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    response.send(template.update_user_HTML(request, feedback));
});

router.get('/my_profile', function (request, response) {
    var fmsg = request.flash();
    var feedback = '';
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    response.send(template.update_user_HTML(request, feedback));
});


router.post('/update', function (request, response) {
    var fmsg = request.flash();
    var feedback = '';
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    db.query(`SELECT * FROM user WHERE id=?`,[request.user.id], function(err, crr_user){
      bcrypt.compare(request.body.current_pw, crr_user[0].password, function(err, result){
        if(request.body.newpw !== request.body.newpw2){
          request.flash('error', 'new Password do not match!!');
          response.redirect('/user/my_profile');
        }
        else if(!result){
          request.flash('error', 'current Password do not match!!');
          response.redirect('/user/my_profile');
        }
         else{
          bcrypt.hash(request.body.newpw, 10, function(err, hash){
            var user = {
              id: request.body.id,
              password: hash,
              name: request.body.name
            };
            db.query(`UPDATE user SET id=?, password=?, name=? WHERE id=?`, [user.id, user.password, user.name,user.id], function(error, state){
              if(error){
                throw error;
              }
              request.login(user, function(err){
                return response.redirect('/user/main');
              });
          });
        });
      }
    });
  });
});


router.post('/update_table', function (request, response) {

  var fmsg = request.flash();
  var feedback = '';
  if (fmsg.error) {
    feedback = fmsg.error[0];
  }
    var post = request.body;
  var day = ['월','화','수','목','금','토','일' ];
  if(request.body.newTitle === null || request.body.newTitle === ""){
    response.redirect(`/user/main`);
  }
  else if(request.body.newTitle ==="삭제"){
    db.query(`DELETE FROM time_table WHERE user_id=? AND day=? AND time=?`,[request.user.id, day[request.query.day],Number(request.query.time)+1],function(error,state){
        if(error){
          throw error;
        }
        response.redirect(`/user/main`);
    });
  }
  else{
    db.query(`UPDATE time_table SET user_id=?, day=?, time=?,title=?, state=? WHERE user_id=? AND day=? AND time=?`,
      [request.user.id,day[request.query.day], Number(request.query.time)+1, post.newTitle, "내꺼", request.user.id, day[request.query.day],Number(request.query.time)+1 ],
      function(error, state){
        if(error){
          throw error;
        }
        if(state.changedRows === 0){
          db.query(`INSERT INTO time_table VALUE(?,?,?,?,?)`,
          [request.user.id, day[request.query.day], Number(request.query.time)+1, post.newTitle, "내꺼"],
          function(error2,state2){
            if(error2){
              throw error2;
            }
            response.redirect(`/user/main`)
          });
          }else{
          response.redirect(`/user/main`)
      };
    });
  }


});





module.exports = router;
