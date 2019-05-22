// Requiring necessary npm middleware packages 
var express = require("express");
var session = require('express-session');
var bodyParser = require("body-parser");

// Setting up port
var PORT = process.env.PORT || 8080;
// Creating express app and configuring middleware 
//needed to read through our public folder
var app = express();

var passport = require('passport');

app.use(bodyParser.urlencoded({ extended: true })); //For body parser
app.use(bodyParser.json());

app.use(express.static("build"));
app.use(express.static("images_products"));

// For Passport ()
/*
app.use(
session({
  secret:'gUkXn2r5u8x/A?D(G+KbPeShVmYq3s6v',
  resave: true,
  saveUnitialized:true,
}));
*/
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {    
  res.sendFile('index.html');
});

// API routes
var routes = require('./router/api')(app);
app.use('/',routes);

//this will listen to and show all activities on our terminal to 
//let us know what is happening in our app
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});
