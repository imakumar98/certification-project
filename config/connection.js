//IMPORT MODULES
const mysql = require('mysql');

const connection = mysql.createConnection({
	multipleStatements: true,
    host : 'localhost',
    user :'root',
	password : '',
	database : 'certificate'
});

connection.connect((err)=>{
	if(err) throw err;
});

module.exports = connection;