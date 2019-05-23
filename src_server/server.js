var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var Sequelize = require("sequelize");
var passport = require('passport');
var fs = require('fs');
const bcrypt = require('bcrypt');

var PORT = process.env.PORT || 8080;

var app = express();

app.use(bodyParser.urlencoded({ extended: true })); //For body parser
app.use(bodyParser.json());

app.use(express.static("build"));
app.use(express.static("images_products"));

// JWT Authetification

// import passport and passport-jwt modules
const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');

// ExtractJwt to help extract the token
let ExtractJwt = passportJWT.ExtractJwt;

// JwtStrategy which is the strategy for the authentication
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};

var pathPrivateKey = __dirname+'\\private.key';
var pathPublicKey = __dirname+'\\public.key';
console.log('priv: ' + pathPrivateKey + ' pub: ' + pathPublicKey);

var privateKEY  = fs.readFileSync(pathPrivateKey, 'utf8');
var publicKEY  = fs.readFileSync(pathPublicKey, 'utf8');

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = privateKEY; // 256 bit key
jwtOptions.publicOrKey = publicKEY;
jwtOptions.expiresIn = "1m";
jwtOptions.algorithm = 'RS256';

// Lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {

  console.log('Payload received', jwt_payload);
  let user = getUser({ id: jwt_payload.id });

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);

// Useful functions database

// Create some helper functions to work on the database
const createUser = async ({ name, password }) => {
    return await User.create({ name, password });
};

const createOrder = async ({ product, userid }) => {
    console.log('twast ', userid);
  return await Order.create({ product, userid });
};

const getUser = async obj => {
    return await User.findOne ({
        where: obj,
    });
};

const getAllUsers = async () => {
    return await User.findAll();
};

const getAllProducts = async () => {
    return await Product.findAll();
};

// Database

const sequelize = new Sequelize({
	database: 'web',
	username: 'root',
	password: 'qwe123qwe',
	dialect: 'mysql',
});

sequelize
	.authenticate()
	.then(() => console.log('Connection has been establised successfully'))
	.catch(err => console.error('Unable to connect',err))

const User = sequelize.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});
User.sync()
    .then(() => console.log('User table craeted successfully'))
    .catch( err => console.log('Unable to connect to the database: ',err));    

const Product = sequelize.define('product', {
    name: {
        type: Sequelize.STRING
    },
    image: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.FLOAT
    },
});
Product.sync()
    .then(() => console.log('Product table created successfully'))
    .catch(err => console.error('Problems with creating product table: ', err));

const Order = sequelize.define('order', {
    userid: {
        type: Sequelize.STRING
    },
    product: {
        type: Sequelize.STRING
    },
});
Order.sync()
    .then(() => console.log('Order table created successfully'))
    .catch(err => console.error('Problems with creating product table: ', err));

//App calls

app.get('/', function(req, res) {
	res.sendFile('index.html');
});

app.get('/hello', function(req, res) {
	res.send('Welcome to Passport with Sequelize and without HandleBar...');
});

app.get('/products', function(req, res) {
	//res.json({products:[{name:'item1', price:13.4/*, image:'image1.jpg'*/},{name:'item2', price:8.5/*, image:'image2.jpg'*/}]});
	getAllProducts().then(products => res.json(products));
});

app.post('/login', async function(req, res, next) {
  const { name, password } = req.body;
  console.log(name, password);
  
  if (name && password) {
    // we get the user with the name and save the resolved promise
    
    let user = await getUser({ name });
    if (!user) {
      res.status(401).json({ msg: 'No such user found', user });
    }
    //console.log(user);
    if (user.password === password) {
      // from now on we’ll identify the user by the id and the id is
      console.log('ready to sign token')
      // the only personalized value that goes into our token
      let payload = { id: user.id };
      let token = jwt.sign(payload, jwtOptions.secretOrKey);
      var returnJson = { msg: 'ok', token: token, userid: payload.id }; 
      console.log(returnJson);
      res.json(returnJson);
    } else {
      res.status(401).json({ msg: 'Password is incorrect' });
    }
  }
});

app.post('/register', function(req, res) {
	const { name, password } = req.body;
	createUser({ name, password }).then(user =>
     	res.json({ name, msg: 'Account created successfully' })
	);
	console.log(req.body);
	//res.json({});
});

app.post('/buy', function(req, res) {
	const {product, userid} = req.body;
	console.log('Item got: ', {product, userid})
	createOrder({product, userid}).then(user =>
		res.json({product, msg: 'Order created successfully'}),
		console.log('Product ', {product}, ' for User №', {userid} ,'was succefully added in Order table')
	);
	//res.json({});
});

/*
app.post('/test', passport.authenticate('jwt',{session:false}), function(req, res) {     
  let token = req.headers.authorization.split(' ')[1];
  console.log('token:', token);
  jwt.verify(token, jwtOptions.publicOrKey, function(err,decode){
    console.log('UserID taked from payload of token:',decode.id);
  });
});
*/

app.listen(PORT, function() {
	console.log("App listening on port " + PORT);
});