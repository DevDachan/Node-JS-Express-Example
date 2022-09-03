var db = require('./db.js');
var bcrypt = require('bcrypt');


module.exports = function (app) {


  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var GoogleStrategy = require('passport-google-oauth2').Strategy;

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function (user, done) {
      done(null, user);
  });

  passport.deserializeUser(function (id, done) {
    if(typeof id === 'string' ){
    db.query(`SELECT * FROM user WHERE id=?`,[id],function(error,user){
      done(null, user[0]);
    });
  }
  else{
    done(null,id);
  }
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
  var googleCredentials = require('../config/google.json');


  passport.use(new GoogleStrategy({
      clientID: googleCredentials.web.client_id,
      clientSecret: googleCredentials.web.client_secret,
      callbackURL: googleCredentials.web.redirect_uris[0],
      passReqToCallback: true,
    },
    function(request,accessToken, refreshToken, profile, done) {
      db.query(`SELECT * FROM user WHERE id=?`, [profile.email], function(error, temp){
        if(error){
          throw error;
        }
        console.log(temp);
        if(temp.length !== 0){
          db.quert(`INSERT INTO user VALUE(?,?,?)`, [profile.email, " ", profile.displayName], function(error2, state){

          })
        }
      })
      var user = {
        id: profile.email,
        name: profile.displayName
      };

         return done(null, user);
    }
  ));

  app.get(
      "/auth/google",
      passport.authenticate("google", { scope: ["email", "profile"] })
  );


  app.get(
      "/auth/google/callback",
      passport.authenticate("google", {
          successRedirect: "/user/main",
          failureRedirect: "/",
      })
  );
  return passport;
}
