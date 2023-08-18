import mongoose, { Schema,model } from "mongoose";

const CartDetails  =   Schema( {

    NFTId:{type:String,default:""},
    NFTOwner:{type:String,default:""},
    ContractType:{type:String,default:""},
    ContractAddress:{type:String,default:""},
    CollectionNetwork:{type:String,default:""},
    buyerAddress:{type:String,default:""},
    fileType:{type:String,default:""},
    quantity:{type:Number,default:1} ,
    CollectionName:{type:String,default:""},


},{timestamps:true})

export default mongoose.model('CartDetails',CartDetails)
