var mysql = require('mysql');

var db2 = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "server"
});

module.exports = db2;