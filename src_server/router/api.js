module.exports = function (app){

	var express = require('express');
	var router =  express.Router();
	var passport = require('passport');
	var fs = require('fs');
	const bcrypt = require('bcrypt');
	const{ User, Product, Order } = require('../db');
	
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
	//console.log('priv: ' + pathPrivateKey + ' pub: ' + pathPublicKey);

	var privateKEY  = fs.readFileSync(pathPrivateKey, 'utf8');
	var publicKEY  = fs.readFileSync(pathPublicKey, 'utf8');

	jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	jwtOptions.secretOrKey = privateKEY; // 256 bit key
	jwtOptions.publicOrKey = publicKEY;
	jwtOptions.expiresIn = "10m";
	jwtOptions.algorithm = 'RS256';

	// Lets create our strategy for web token
	let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {

	  //console.log('Payload received', jwt_payload);
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
	const createUser = async ({ name, password, email }) => {
	    return await User.create({ name, password, email });
	};

	const createOrder = async ({ product, userid }) => {
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

//Routes

	router.get('/', function(req, res) {
		res.sendFile('index.html');
	});


	router.get('/products', function(req, res) {
		//res.json({products:[{name:'item1', price:13.4/*, image:'image1.jpg'*/},{name:'item2', price:8.5/*, image:'image2.jpg'*/}]});
		getAllProducts().then(products => res.json(products));
	});

	router.post('/login', async function(req, res, next) {
	  	const { name, password } = req.body;
	  		  
	  	if (name && password) {
	    // we get the user with the name and save the resolved promise
	    
		    let user = await getUser({ name });
		    if (!user) {
		      res.status(401).json({ msg: 'No such user found', user });
		    }
		    bcrypt.compare(password, user.password, function(err, res2) {
			    if(res2) {
			    	// from now on we’ll identify the user by the id and the id is
					//console.log('ready to sign token')
					// the only personalized value that goes into our token
					let payload = { id: user.id };
					let token = jwt.sign(payload, jwtOptions.secretOrKey);
					var returnJson = { msg: 'ok', token: token/*, userid: payload.id*/ }; 
					//console.log(returnJson);
					res.json(returnJson);
			    } else {
			    	res.status(401).json({ msg: 'Password is incorrect' });
			    }
			});
	  	}
	});

	router.post('/register', function(req, res) {
		const { name, password, email } = req.body;
		const saltRounds = 10;
		bcrypt.hash(password,saltRounds,function(err,hash){
	    	//console.log('hashpassword:',hash)
		    var password = hash;
		    createUser({ name, password, email }).then(user =>
		     	res.json({ name, msg: 'Account created successfully' })
		    );
		  });
		//console.log(req.body);
		//res.json({});
	});

	router.post('/buy', function(req, res) {
		const {product, token} = req.body;

	  let ntoken = {token};
	    
	  //Getting Id from Token
	  userid = jwt.verify(ntoken.token,jwtOptions.secretOrKey,function(err,decode){
	    //console.log('UserID taked from payload of token:',decode.id);
	    return decode.id;
	  });

		//console.log('Item got: ', {product, userid});
		createOrder({product, userid}).then(user =>
			res.json({product, msg: 'Order created successfully'}),
			//console.log('Product ', {product}, ' for User №', {userid} ,'was succefully added in Order table')
		);
		//res.json({});
	});

	router.post('/logout', function(req, res, next) {
  
	});

	return router;
}