var template = require('./lib/template.js');
const express = require('express');
var app = express();
var fs = require('fs');

var path = require('path');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');
var bodyParser = require('body-parser');
var session = require('express-session')
var compression = require('compression');
var flash = require('connect-flash');

app.use(bodyParser.urlencoded({extended: false}));

app.use(compression());
app.use(session({
  secret: 'asadlfkj!@#!@#dfgasdg',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
// 위로 올리면 error
var passport = require('./lib/passport')(app);

// login 화면
app.get('/', function(request, response){
  var fmsg = request.flash();
  var feedback = '';
  if (fmsg.error) {
    feedback = fmsg.error[0];
  }
  response.send(template.login_HTML(feedback));
});


var loginRouter = require('./routes/login')(passport);
var userRouter = require('./routes/user');
var roomRouter = require('./routes/room');


app.use('/login', loginRouter);
app.use('/user', userRouter);
app.use('/room', roomRouter);



//----------  error detect ---------
app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
  res.status(500).send('Something broke!')
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
