const sqlite3  = require('sqlite3').verbose();
const db       = new sqlite3.Database('./Database/DataOrang.db');
console.log("Database tersambung");
// db.run("CREATE TABLE user (id INT, username TEXT , password)");
module.exports = db;