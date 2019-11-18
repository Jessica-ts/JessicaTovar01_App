/*const mongoose = require('mongoose');
const Schema = mongoose.Schema;*/

const {Schema, model} = require('mongoose');
const ObjectId = Schema.ObjectId;

const CommentSchema = Schema(
{
	post_id: { type: ObjectId },
	comment: { type: String },
	postedBy: { type: String },
	timestamp : {type: Date, default: Date.now}
});

module.exports = model('Comment', CommentSchema);