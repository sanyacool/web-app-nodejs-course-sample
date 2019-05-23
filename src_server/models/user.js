module.exports = (sequelize,Sequelize) =>{

	const User = sequelize.define('user', {
	    name: {
	        type: Sequelize.STRING,
	        allowNull: false
	    },
	    password: {
	        type: Sequelize.STRING,
	        allowNull: false
	    },
	    email: {
	        type: Sequelize.STRING,
	        allowNull: false
	    }
	});
	User.sync()
	    .then(() => console.log('User table craeted successfully'))
	    .catch( err => console.log('Unable to connect to the database: ',err));   

	return User;
}