module.exports = (sequelize,Sequelize) =>{

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

	return Order;
}