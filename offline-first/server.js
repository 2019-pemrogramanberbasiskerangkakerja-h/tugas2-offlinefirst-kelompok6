
var http = require('http');  
var url = require('url');  
var fs = require('fs');  
var express = require('express');
var session = require('express-session');
var query_string = require('querystring');
var path = require("path");
const db    = require('./Database/db'); //local
const db2 = require("./db_config"); //master

// var internetAvailable = require("internet-available");
var host = "127.0.0.1";
var port = 8082;
var isOnline = require('is-online');

// app.use(express.static(__dirname + "/public")); //use static files in ROOT/public folder
var app = express();

var myLogger = function (req, res, next) {
  doSync()
  next()
}

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}), myLogger);

var doSync = function() {
  const sql = `SELECT * FROM UserLogs WHERE status = 0`;
  let query4 = `SELECT * FROM user where status = 0`;
  let query5 = `UPDATE user SET status = ? where id = ?`;
  isOnline().then(online => {
      if(online){
        var status = 1;

        db.all(sql, [], (err, rows) => {
          if (err) {
            throw err;
          }
          rows.forEach((row) => {
            //insert into master
            var id = row.id;

            let query3 = `INSERT INTO user (username, password, status) 
                           VALUES (?, ?, ?)`;

            db2.query(query3, [row.username, row.password, status], function (err, result) {
                if (err) throw err;
            });
            
            const query4 = `UPDATE UserLogs SET status = ? WHERE id = ?`;
            db.run(query4, status, id ,function (err , row) {
              if (err) {   
                console.log(err.message);  
              }else{
                console.log("Sinkronisasi berhasil");
              }     
            });

          });
        });

        db2.query(query4, function (err, result){
          result.forEach((row) => {
            insertUserAndLogs(row.username, row.password, status, function(result){
              if(result == "berhasil") {
                console.log("berhasil");
              }
            });
            db2.query(query5, [1, row.id], function(err, result){
              if(err) {
                console.log(err.message);
              } else {
                console.log("Update status berhasil");
              }
            });
          });
        });
        console.log("Synced");
      } else {
        console.log("Offline")
      }
    });
  
}

var insertUserAndLogs = function(username, password, status, callback) {
  const query = `INSERT INTO user (username , password)
               VALUES (? , ?)`;
  db.get(query , username, password ,function (err , row) {
    if (err) {           
         console.log(err.message);
         callback("gagal");
    } else {
      
      const query2 = `INSERT INTO UserLogs(username , date , status , password) VALUES (? , ? , ?, ?)`;
      var date = Date() ;

      db.run(query2, username, date , status , password ,function (err , row) {
        if (err) {
          console.log(err.message);
          callback("gagal");
        }else{
          console.log("insert log berhasil");
          callback("berhasil");
        }     
      });
    }
  });
}

app.get("/login", function(req, resp){ //root dir
  if(!req.session.loggedin){
    resp.sendFile(__dirname + '/public/login.html');
  }else{
    resp.redirect('/');
  }
});

app.get("/register", function(req, resp){ //root dir
  if(!req.session.loggedin){
    resp.sendFile(__dirname + '/public/register.html');
  }else{
    resp.redirect('/');
  }
});

app.get("/", function(req, resp){ //root dir
    if(!req.session.loggedin){
          resp.sendFile(__dirname + '/public/home.html');

  }else{
    req.session.username;
     resp.sendFile(__dirname + '/public/sukseshome.html');
  }
});


app.get("/sukseslogin", function(req, resp){
  if(!req.session.loggedin){
    resp.redirect('/');
  }else{
    resp.sendFile(__dirname + '/public/sukseslogin.html');
  }
});

app.get("/gagalogin", function(req, resp){
  if(!req.session.loggedin){
    resp.sendFile(__dirname + '/public/gagalogin.html');
  }else{
    resp.redirect('/');
  }
});

app.post("/login", function(req, resp){
        doSync();

       if (req.method == 'POST') {
       var req_body = '';
        req.on('data', function (data) {
            req_body += data;

            if (req_body.length > 1e6)
                req.connection.destroy();
        });



        req.on('end', function () {
            var post_data = query_string.parse(req_body);
            var user_name = post_data["user_name"];
            var password = post_data["password"];
            const query = `SELECT * FROM user WHERE username = ? and password = ?`;        

            db.get(query , user_name, password ,function (err , row) {
              if (!row) {           
                     req.user_name = user_name;
                     req.password = password;
                  resp.redirect('/gagalogin');

               resp.end();
              }else{
                req.session.loggedin = true;
                req.session.username = user_name;
                resp.redirect('/sukseslogin');
              }
                
            });
        });
    }
});

app.post("/register", function(req, resp){ //root dir
    const query = `INSERT INTO user (username, password)
               VALUES ('?', '?')`;
    var query_string = require('querystring');

    if (req.method == 'POST') {
       var req_body = '';
        req.on('data', function (data) {
            req_body += data;
            if (req_body.length > 1e6)
                req.connection.destroy();
        });

          req.on('end', function () {
            var post_data = query_string.parse(req_body);
            var status = 0;

            insertUserAndLogs(post_data["user_name"], post_data["password"], status, function(result){
              console.log(result);
              if(result == "berhasil") {
                resp.redirect('/');
              } else {
                resp.redirect('/gagalogin');
              }
            });
        });
    }
});

app.get("/logout", function(req, resp){
    req.session.username = null;
    req.session.loggedin = null;
    resp.redirect('/login');
});

app.listen(port, host);
console.log("listening to port "+ 8082)