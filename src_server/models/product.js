module.exports = (sequelize,Sequelize) =>{
    const Product = sequelize.define('product', {
        name: {
          type: Sequelize.STRING,
        },
        image: {
          type: Sequelize.STRING,
        },
        price: {
          type: Sequelize.FLOAT,
        },
      });
    /*  
    Product.sync()
        .then(() => console.log('Product table created successfully'))
        .catch(err => console.log('oooh, did you enter wrong database credentials?'));
    */
    return Product; 
}