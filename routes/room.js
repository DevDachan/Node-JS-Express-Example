const express = require('express');
var fs = require('fs');
var app = express();
var template = require('../lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');
var bodyParser = require('body-parser');
var db = require('../lib/db.js');
var router = express.Router();


//room?id=45454 로 지정하기

var day = ['월','화','수','목','금','토','일' ];

router.post('/enter_room_state', function (request, response) {
  db.query(`SELECT * FROM kick_list WHERE room_id=? AND user_id=?`,[request.body.input_room_id,request.user.id],function(err,kick){
    if(err){
      throw err;
    }
    if(kick.length !== 0){
      request.flash('error', 'Your kicked user!!');
      response.redirect('/user/main');
    }
    else{
          db.query(`SELECT * FROM user_room WHERE room_id=?`, [request.body.input_room_id], function(error, room){
            if(error){
              throw error;
            }
            if(room.length === 0){
              request.flash('error', 'room num is not exists!!');
              response.redirect('/user/main');
            }
            else {
              db.query(`SELECT * FROM user_room WHERE user_id = ? AND room_id=?`, [request.user.id,request.body.input_room_id], function(error2,room_check){
                if(error2){
                  throw error2;
                }
                if(room_check.length === 0){
                  db.query(`INSERT INTO user_room VALUE(?,?,?)`, [request.user.id,request.body.input_room_id,"참가자"],function(error3,state){
                    if(error3){
                      throw error3;
                    }

                    response.redirect('/room?id='+request.body.input_room_id);
                  })
                }
                else{
                    response.redirect('/room?id='+request.body.input_room_id);
                }
            });
          }
        });
      }
  });
});


router.post('/create_room', function (request, response) {
  var fmsg = request.flash();
  var feedback = '';
  if (fmsg.error) {
    feedback = fmsg.error[0];
  }
  response.send(template.create_room_HTML(request, feedback));
});

router.get('/create_room', function (request, response) {
  var fmsg = request.flash();
  var feedback = '';
  if (fmsg.error) {
    feedback = fmsg.error[0];
  }
  response.send(template.create_room_HTML(request, feedback));
});

router.post('/create_room_state', function (request, response) {
  var post = request.body;
  db.query(`SELECT * FROM room WHERE room_id =?`,[post.id], function(err, already){
      if(err){
        throw err;
      }
      if(already.length !== 0){
        request.flash('error', 'Room id already exists !!');
        response.redirect('/room/create_room');
      }else{
        db.query(`INSERT INTO room VALUE(?,?,?,?)`, [post.id, post.name, post.limit,request.user.id], function(error, state1){
          if(error){
            throw error;
          }
          db.query(`INSERT INTO user_room VALUE(?,?,?)`, [request.user.id,post.id,"방장"],function(error2, state2){
            if(error2){
              throw error2;
            }
            response.redirect(`/room?id=${post.id}`);
        });
      });
    }
  });
});


router.post('/', function (request, response) {
  db.query(`SELECT * FROM room WHERE room_id = ?`,[request.query.id],function(error,room_info){
    if(error){
      throw error;
    }
    db.query(`SELECT * FROM time_table WHERE user_id=?`,[request.user.id], function(error2,user){
      if(error2){
        throw error2;
      }
      db.query(`SELECT * FROM time_table join user_room USING(user_id) WHERE room_id = ? ;`,[request.query.id], function(error3,time_table_room){
        if(error3){
          throw error3;
        }
        db.query(`SELECT * FROM user_room JOIN user ON user_id = id WHERE room_id = ?`,[request.query.id],function(error4, member_list){
          if(error4){
            throw error4
          }
          db.query(`select * from babgo LEFT JOIN day_list USING(day) WHERE room_id = ? ORDER BY day_index, time`,[request.query.id], function(error5,babgo){
            if(error5){
              throw error5;
            }
            db.query(`SELECT state FROM user LEFT JOIN user_room ON user_id=id WHERE user_id =? AND room_id=?`,[request.user.id, request.query.id], function(error6,state){
              if(error6){
                throw error6;
              }
              db.query(`SELECT * FROM kick_list WHERE room_id =?`,[ request.query.id], function(error7,kick_info){
                if(error7){
                  throw error7;
                }
          //---------------------------------   user time_table  ----------------------------------------
                var user_time = new Array(7);
                for(var i = 0; i < 7 ; i++){
                  user_time[i] = new Array(7);
                }

                for(var i = 0; i<7; i++){
                  for(var k = 0; k<7; k++){
                    user_time[i][k] = " ";
                  }
                }

                for(var i = 0; i< user.length; i++){
                    user_time[day.indexOf(user[i].day)][user[i].time-1] = user[i].title;
                }
          //---------------------------------   total time_table  -----------------------------------------
                var room_timetable =new Array(7);
                for(var i = 0; i < 7 ; i++){
                  room_timetable[i] = new Array(7);
                }

                for(var i = 0; i<7; i++){
                  for(var k = 0; k<7; k++){
                    room_timetable[i][k] = 0;
                  }
                }
                for(var i = 0; i< time_table_room.length; i++){
                    room_timetable[day.indexOf(time_table_room[i].day)][time_table_room[i].time-1]++;
                }
                for(var i = 0; i< babgo.length; i++){
                    room_timetable[day.indexOf(babgo[i].day)][babgo[i].time-1] = '밥고';
                }

        //---------------------------------   bab bab birara  -----------------------------------------
                var babgo_color_list =new Array(7);
                for(var i = 0; i < 7 ; i++){
                  babgo_color_list[i] = new Array(7);
                }
                for(var i = 0; i<7; i++){
                  for(var k = 0; k<7; k++){
                    if(room_timetable[i][k] === 0){
                      babgo_color_list[i][k] = '#FFF0F5';
                    }
                    else if(room_timetable[i][k] === 1){
                      babgo_color_list[i][k] = '#65FFBA';
                    }
                    else if(room_timetable[i][k] === 2){
                      babgo_color_list[i][k] = '#87F5F5';
                    }
                    else if(room_timetable[i][k] > 2){
                      babgo_color_list[i][k] = '#FFBCB9';
                    }
                  }
                }
                for(var i = 0; i< babgo.length; i++){
                    babgo_color_list[day.indexOf(babgo[i].day)][babgo[i].time-1] = '#93DAFF';
                }
                response.send(template.room_HTML(request,  room_info[0],  member_list,   user_time,   room_timetable,   babgo_color_list,   babgo,state[0],kick_info));
                });
              });
            });
          });
        });
      });
    });
});
router.get('/', function (request, response) {
  db.query(`SELECT * FROM room WHERE room_id = ?`,[request.query.id],function(error,room_info){
    if(error){
      throw error;
    }
    db.query(`SELECT * FROM time_table WHERE user_id=?`,[request.user.id], function(error2,user){
      if(error2){
        throw error2;
      }
      db.query(`SELECT * FROM time_table join user_room USING(user_id) WHERE room_id = ? ;`,[request.query.id], function(error3,time_table_room){
        if(error3){
          throw error3;
        }
        db.query(`SELECT * FROM user_room JOIN user ON user_id = id WHERE room_id = ?`,[request.query.id],function(error4, member_list){
          if(error4){
            throw error4
          }
          db.query(`select * from babgo LEFT JOIN day_list USING(day) WHERE room_id = ? ORDER BY day_index, time`,[request.query.id], function(error5,babgo){
            if(error5){
              throw error5;
            }
            db.query(`SELECT state FROM user LEFT JOIN user_room ON user_id=id WHERE user_id =? AND room_id=?`,[request.user.id, request.query.id], function(error6,state){
              if(error6){
                throw error6;
              }
              db.query(`SELECT * FROM kick_list WHERE room_id =?`,[ request.query.id], function(error7,kick_info){
                if(error7){
                  throw error7;
                }
          //---------------------------------   user time_table  ----------------------------------------
                var user_time = new Array(7);
                for(var i = 0; i < 7 ; i++){
                  user_time[i] = new Array(7);
                }

                for(var i = 0; i<7; i++){
                  for(var k = 0; k<7; k++){
                    user_time[i][k] = " ";
                  }
                }

                for(var i = 0; i< user.length; i++){
                    user_time[day.indexOf(user[i].day)][user[i].time-1] = user[i].title;
                }
          //---------------------------------   total time_table  -----------------------------------------
                var room_timetable =new Array(7);
                for(var i = 0; i < 7 ; i++){
                  room_timetable[i] = new Array(7);
                }

                for(var i = 0; i<7; i++){
                  for(var k = 0; k<7; k++){
                    room_timetable[i][k] = 0;
                  }
                }
                for(var i = 0; i< time_table_room.length; i++){
                    room_timetable[day.indexOf(time_table_room[i].day)][time_table_room[i].time-1]++;
                }
                for(var i = 0; i< babgo.length; i++){
                    room_timetable[day.indexOf(babgo[i].day)][babgo[i].time-1] = '밥고';
                }

        //---------------------------------   bab bab birara  -----------------------------------------
                var babgo_color_list =new Array(7);
                for(var i = 0; i < 7 ; i++){
                  babgo_color_list[i] = new Array(7);
                }
                for(var i = 0; i<7; i++){
                  for(var k = 0; k<7; k++){
                    if(room_timetable[i][k] === 0){
                      babgo_color_list[i][k] = '#FFF0F5';
                    }
                    else if(room_timetable[i][k] === 1){
                      babgo_color_list[i][k] = '#65FFBA';
                    }
                    else if(room_timetable[i][k] === 2){
                      babgo_color_list[i][k] = '#87F5F5';
                    }
                    else if(room_timetable[i][k] > 2){
                      babgo_color_list[i][k] = '#FFBCB9';
                    }
                  }
                }
                for(var i = 0; i< babgo.length; i++){
                    babgo_color_list[day.indexOf(babgo[i].day)][babgo[i].time-1] = '#93DAFF';
                }
                response.send(template.room_HTML(request,  room_info[0],  member_list,   user_time,   room_timetable,   babgo_color_list,   babgo,state[0],kick_info));
                });
              });
            });
          });
        });
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

  if(request.body.newTitle === null || request.body.newTitle === ""){
    response.redirect(`/room?id=${request.body.room_id}`);
  }

  else if(request.body.newTitle ==="삭제"){
    db.query(`DELETE FROM time_table WHERE user_id=? AND day=? AND time=?`,[request.user.id, day[request.query.day],Number(request.query.time)+1],function(error,state){
        if(error){
          throw error;
        }
        response.redirect(`/room?id=${request.body.room_id}`);
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
            response.redirect(`/room?id=${request.body.room_id}`)
          });
          }else{
          response.redirect(`/room?id=${request.body.room_id}`)
      };
    });
  }
});


router.post('/create_babgo', function (request, response) {
  var fmsg = request.flash();
  var feedback = '';
  if (fmsg.error) {
    feedback = fmsg.error[0];
  }
  response.send(template.create_babgo_HTML(request,feedback));
});


router.get('/create_babgo', function (request, response) {
  var fmsg = request.flash();
  var feedback = '';
  if (fmsg.error) {
    feedback = fmsg.error[0];
  }
  response.send(template.create_babgo_HTML(request,feedback));
});


router.post('/create_babgo_state', function (request, response) {
  var post = request.body;
  db.query(`SELECT * FROM babgo WHERE room_id=? AND day=? AND time=?`, [post.id, post.day, post.time], function(error, alredy){
    if(error){
      throw error;
    }
    if(alredy.length !== 0 ){
      request.flash('error', 'Bobgo already exists at this time!!!');
      response.redirect(`/room?id=${post.id}`);
    }
    else if(day.indexOf(post.day) === -1 ){
      request.flash('error', 'Day error!!');
      response.redirect(`/room/create_babgo?room_id=${post.id}`);
    }
    else{
      db.query(`INSERT INTO babgo VALUE(?,?,?)`, [post.id, post.day, post.time], function(error2, state2){
        if(error2){
          throw error2;
        }
        response.redirect(`/room?id=${post.id}`);
      });
    }
  });
});


router.post('/delete_babgo', function (request, response) {
  var post = request.body;


  db.query(`DELETE FROM babgo WHERE room_id = ? AND day = ? AND time =?`, [post.room_id, post.day, post.time], function(error, state){
    if(error){
      throw error;
    }
    response.redirect(`/room?id=${post.room_id}`);
  });
});


router.post('/goout', function(request, response){
  var post = request.body;

  db.query(`DELETE FROM user_room WHERE room_id=? AND user_id=?`,[post.room_id, request.user.id], function(error, state){
    if(error){
      throw error;
    }
      response.redirect(`/user/main`);
  });
});

router.post('/delete_room', function(request, response){
  var post = request.query;

  db.query(`DELETE FROM user_room WHERE room_id=?`,[post.room_id], function(error, state){
    if(error){
      throw error;
    }
    db.query(`DELETE FROM room WHERE room_id=?`,[post.room_id], function(error2, state){
      if(error2){
        throw error2;
      }
      db.query(`DELETE FROM babgo WHERE room_id=?`,[post.room_id], function(error3, state){
        if(error3){
          throw error3;
        }
      response.redirect(`/user/main`);
    });
  });
});
});
router.post('/kick_user', function(request, response){
  var post = request.body;

  db.query(`DELETE FROM user_room WHERE user_id=?`,[post.user_id], function(error, state){
    if(error){
      throw error;
    }
    db.query(`INSERT INTO kick_list VALUE(?,?)`,[post.room_id,post.user_id], function(error2, state){
      if(error2){
        throw error2;
      }
      response.redirect(`/room?id=${post.room_id}`);
    });
  });
});


router.post('/delete_kick', function(request, response){
  var post = request.body;

  db.query(`DELETE FROM kick_list WHERE room_id=? AND user_id=?`,[post.room_id, post.user_id], function(error, state){
    if(error){
      throw error;
    }
      response.redirect(`/room?id=${post.room_id}`);
    });
});


module.exports = router;
