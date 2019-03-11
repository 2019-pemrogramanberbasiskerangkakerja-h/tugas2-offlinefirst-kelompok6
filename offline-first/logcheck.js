const sqlite3  = require('sqlite3').verbose();
const db       = new sqlite3.Database('./Database/DataOrang.db');
console.log("Database tersambung");
// db.run("CREATE TABLE UserLogs (id INT, username TEXT , date TEXT)");
	
const query2 = `INSERT INTO UserLogs(username , date) VALUES (? , ?)`;
var nama = 'rifka';
var date = Date() ;

     db.run(query2, nama, date ,function (err , row) {
              if (err) {   
              	console.log("gagal");
              	
              }else{
              	console.log("berhasil");
              }
                
        });



module.exports = db;