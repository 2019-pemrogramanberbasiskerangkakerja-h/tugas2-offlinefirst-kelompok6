
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

app.get("/register", function(req, resp){ //root dir
  if(!req.session.loggedin){
    resp.sendFile(__dirname + '/public/register.html');
  }else{
    resp.redirect('/');
  }
});

app.get("/home", function(req, resp){ //root dir
    if(!req.session.loggedin){
          resp.sendFile(__dirname + '/public/home.html');

  }else{
    req.session.username;
     resp.sendFile(__dirname + '/public/sukseshome.html');

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
            const query2 = `INSERT INTO UserLog (username , date)
               VALUES (? , ?)`;
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

                const query2 = `INSERT INTO UserLogs(username , date) VALUES (? , ?)`;
                var nama = req.session.username;
                var date = Date() ;

                 db.run(query2, nama, date ,function (err , row) {
                          if (err) {   
                            console.log("gagal");
                            
                          }else{
                            console.log("berhasil");
                          }
                
        });

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
            // If the POST data is too much then destroy the connection to avoid attack.
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (req_body.length > 1e6)
                req.connection.destroy();
        });

              req.on('end', function () {
            var post_data = query_string.parse(req_body);
            var user_name = post_data["user_name"];
            // console.log(user_name);
            var password = post_data["password"];
            const query = `INSERT INTO user (username , password)
               VALUES (? , ?)`;
            // console.log(password);

            db.get(query , user_name, password ,function (err , row) {
              if (err) {           
                     req.user_name = user_name;
                     req.password = password;
                  resp.redirect('/gagalogin');

               resp.end();
              }else{
                // req.session.loggedin = true;
                // req.session.username = user_name;
                console.log(req.session.loggedin);

                 resp.redirect('/');
              }
                
            });
        });
     

        // req.on('end', function () {
        //   // Parse post data from request body, return a JSON string contains all post data.
        //     var post_data = query_string.parse(req_body);
        //     // Get user name from post data.
        //     var user_name = post_data["user_name"];
        //     console.log(user_name);
        //     // Get password from post data.
        //     var password = post_data["password"];
        //     // If user name and password is correct.
        //     console.log(password);

        //     const query = `INSERT INTO user (username , password)
        //        VALUES (? , ?)`;

        //     db.run(query, [user_name , password] , function (err , row) {
        //       if (err) throw err;
        //       console.log("registrasi berhasil");
        //           resp.writeHead(200, {'Content-Type':'text/html'});

        //             var page_title = "Register Success";

        //             var page_menu = http_util.pageMenu();

        //             var page_content = "User info registration success.";

        //     });
         
        // });
    }
});


app.get("/", function(req, resp){ 
    resp.redirect('/home');     

});

app.get("/logout", function(req, resp){ //root dir
    console.log(req.session.loggedin);
    console.log(req.session.username);
    req.session.username = null;
    req.session.loggedin = null;
    resp.redirect('/login');
});

app.listen(port, host);
console.log("listening to port "+ 8082)