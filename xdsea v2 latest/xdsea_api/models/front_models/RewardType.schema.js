import mongoose, { Schema,model } from "mongoose";
 
 
  const RewardTypeSchema = new Schema({
    addressContract: {
      type: String,
    },
    type: {
      type: String,
      enum: ["nft", "coin", "token"],
      default: "token",
    },
    name: {
      type: String,
    },
    iconUrl: {
      type: String,
    },
    color: {
      type: String,
    },
  },{timestamps:true});

  
  export default mongoose.model('RewardType',RewardTypeSchema)


 
