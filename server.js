
var http = require('http');  
var url = require('url');  
var fs = require('fs');  
var express = require('express');
var session = require('express-session');
var query_string = require('querystring');
var path = require("path");
const db    = require('./Database/db');

var host = "127.0.0.1";
var port = 8082;

// app.use(express.static(__dirname + "/public")); //use static files in ROOT/public folder
var app = express();

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));


app.get("/login", function(req, resp){ //root dir
  if(!req.session.loggedin){
    resp.sendFile(__dirname + '/public/login.html');
  }else{
    resp.redirect('/');
  }
});

app.get("/sukseslogin", function(req, resp){ //root dir
  if(!req.session.loggedin){
    resp.redirect('/');
  }else{
    resp.sendFile(__dirname + '/public/sukseslogin.html');
  }
});

app.get("/gagalogin", function(req, resp){ //root dir
  if(!req.session.loggedin){
    resp.sendFile(__dirname + '/public/gagalogin.html');
  }else{
    resp.redirect('/');
  }
});

app.post("/login", function(req, resp){ //root dir
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
            // console.log(user_name);
            var password = post_data["password"];
            const query = `SELECT * FROM user WHERE username = ? and password = ?`;        
            // console.log(password);

            db.get(query , user_name, password ,function (err , row) {
              if (!row) {           
                     req.user_name = user_name;
                     req.password = password;
                  resp.redirect('/gagalogin');

               resp.end();
              }else{
                req.session.loggedin = true;
                req.session.username = user_name;
                console.log(req.session.loggedin);

                 resp.redirect('/sukseslogin');
              }
                
            });
        });
    }
});


app.get("/", function(req, resp){ //root dir
    // console.log(req.session.loggedin);
    console.log(req.session.username);
    if (!req.session.loggedin) {
    var body = "<pre> SELAMAT DATANG </pre><p><h3></h3></p>"
            + " <a href='/login' >KLIK LOGIN</a> "
 
         resp.write(body);
         // resp.end();     
       } else{
       var body = "<pre> SELAMAT DATANG </pre></p>"
                  + req.session.username
         resp.write(body);
         // resp.end();    
       }

});

app.listen(port, host);
console.log("listening to port "+ 8082)