const mongoose = require('mongoose');

require('dotenv').config({path: 'variables.env'});

mongoose.connect(process.env.DB_URL, {
	useCreateIndex: true,
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useFindAndModify: false
})

	.then(db => console.log('DB is connected'))
	.catch(err => console.error(err));



	
