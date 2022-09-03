var mysql = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '7894',
  database : 'bapgo'
});
db.connect();

module.exports = db;
