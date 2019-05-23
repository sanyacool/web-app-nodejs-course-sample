var express = require("express");
var bodyParser = require("body-parser");
var passport = require('passport');
//var session = require("express-session");

var PORT = process.env.PORT || 8080;

var app = express();

app.use(bodyParser.urlencoded({ extended: true })); //For body parser
app.use(bodyParser.json());

app.use(express.static("build"));
app.use(express.static("images_products"));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
  res.sendFile('index.html');
});

// API routes
var routes = require('./router/api')(app);
app.use('/',routes);

app.listen(PORT, function() {
	//console.log("App listening on port " + PORT);
});