module.exports = (sequelize,Sequelize) =>{

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

	return Product; 
}