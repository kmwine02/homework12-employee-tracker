const mysql = require('mysql2');
const util = require('util');


let db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "employees_db"
});


db.connect(function (err) {
    if (err) throw err;
});


module.exports = db;