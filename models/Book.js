const mongoose = require('mongoose');
const {Schema} = mongoose;
const path = require('path');

const coverImageBasePath = 'uploads/bookCovers'

const BookSchema = new Schema({
	title: String,
	author: String,
	description: String,
	price: String,
	store: String,
	filename: { type: String },
	date: {type: Date, default: Date.now},
	user : {type : String}
});


//Variable virtual, no se almacenará en la BD
/*BookSchema.virtual('imageId')	//el imageId extrae la extensión
	.get(function()
	{
		return this.filename.replace(path.extname(this.filename), '');
	});*/


module.exports= mongoose.model('Book', BookSchema);
