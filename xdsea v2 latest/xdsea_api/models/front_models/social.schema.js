 // import package
import mongoose from 'mongoose';


const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const SocialLinksSchema = new Schema({
  website:{
    type:String,
    required:true
  },
  link:{
    type:String,
    required:true
  }
});


module.exports = mongoose.model("SocialLinks", SocialLinksSchema, "SocialLinks");