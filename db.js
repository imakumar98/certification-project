var mysql = require('mysql');
var connection = mysql.createConnection({
	  multipleStatements: true,
     
      host     : 'localhost',
      user     :"henrqfaw_henry",
      password : "^*OWu&u(Bbw=",
      database : "henrqfaw_henry"
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;