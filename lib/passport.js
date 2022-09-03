var db = require('./db.js');
var bcrypt = require('bcrypt');


module.exports = function (app) {


  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function (user, done) {
      done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    db.query(`SELECT * FROM user WHERE id=?`,[id],function(error,user){
      done(null, user[0]);
    });
  });

  passport.use(new LocalStrategy({
          usernameField: 'id',
          passwordField: 'pw'
      },
      function (userid, password, done) {

        db.query(`SELECT * FROM user WHERE id=? `,[userid],function(error, user){
            if(error){
              throw error;
            }
              bcrypt.compare(password, user[0].password, function(err, result){
                if (result) {
                  console.log('input pwd',password);
                  console.log('hash pwd',user[0].password);
                    return done(null, user[0], { message: 'Welcome.'});
                }
                else {
                    return done(null, false, { message: 'Incorrect Information.'});
                }
            });
    });
  }
));

  return passport;
}
