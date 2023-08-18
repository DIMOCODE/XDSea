// import package
import {model,Schema} from 'mongoose'

const LikesSchema = new Schema({
	NFTId: {
		type: String, //changed
		default: 0
	},
	WalletAddress: {
		type: String,
		default: ""
	},
	deleted: {
		type: Number,
		default: 1, // 1 Active 0 Deleted
	},
	WalletAddress: {
		type: String,
		default: ""
	},

},{timestamps:true})
module.exports = model("likes", LikesSchema)