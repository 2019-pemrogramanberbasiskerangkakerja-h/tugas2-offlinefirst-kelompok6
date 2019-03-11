const sqlite3  = require('sqlite3').verbose();
const db       = new sqlite3.Database('./Database/DataOrang.db');
// const db       = new sqlite3.Database('./DataOrang.db');
console.log("Database tersambung");
// db.run("CREATE TABLE user (id INT, username TEXT , password)");

// const query2 = `INSERT INTO UserLog (Nama , Date) VALUES (rifka , Date())`;

//             db.get(query2 ,function (err , row) {
//               if (err) {   
              	
//               }else{
//               	console.log(row);
//               }
                
//             });
module.exports = db;