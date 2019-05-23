const Sequelize = require("sequelize");

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

var UserModel = require('./models/user');
var ProductModel = require('./models/product');
var OrderModel = require('./models/order');

const User = UserModel(sequelize, Sequelize);
const Product = ProductModel(sequelize, Sequelize);
const Order = OrderModel(sequelize, Sequelize);

// Create database and tables if doesn't exist
sequelize.sync()//{force:true}
.then(()=>{
  //console.log('Database and tables created!!');
})

module.exports = {
    User,
    Product,
    Order
}