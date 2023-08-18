const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let cms = new Schema({
	question:{
		type:String
	},
	answer:{
		type:String,
		required:true,
	},
	link:{
		type:String,
		required:true,
	},
	slug:{
		type:String,
		required:true,
	},
	deleted : {
		type:Number,
		default:0,
	}
},{timestamps:true});
module.exports = mongoose.model('cms',cms,'cms');
