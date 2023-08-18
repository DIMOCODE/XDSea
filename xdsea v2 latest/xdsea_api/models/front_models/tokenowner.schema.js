
import mongoose, { Schema,model } from "mongoose";
const NFTOwnerDetails  =   Schema(  {
    NFTId                 :   {   type : String , default : ''},
    NFTOwner              :   {   type : String , default : ''},
    HashValue               :   {   type : String , default : ''},
    PutOnSale               :   {   type : String , default : 'false'},
    PutOnSaleType           :   {   type : String , default : 'UnlimitedAuction'},
    NFTPrice              :   {   type : String , default : ''},
    CoinName                :   {   type : String , default : ''},
    Status                  :   {   type : String , default : 'not-list'},  //options : list notlist
    NFTQuantity           :   {   type : String , default : ''},  
    NFTBalance            :   {   type : String , default : ''},
    // ClockTime               :   {   type : Date , default : null},
    // EndClockTime            :   {   type : Date , default : null},
    ClockTime               :   {   type : String , default : null},
    EndClockTime            :   {   type : String , default : null},
    HideShow                :   {   type : String , default : "visible"},
    deleted                 :   {   type : Number , default : 0},
    burnToken               :   {   type:Number,default:0},
    Platform                :   {   type:String,default:'XDC'},
    bannerpromotion         :   {   type:Boolean,default:false},
    CollectionName          :   {   type:String,default:''},
    isStakeable: {
        type: Boolean,
        default: false,
      },
    isStake: {
        type: Boolean,
        default: false,
      },
    backedValue: {
        type: Number,
        default: 1,
      },
    SaleStatus:{
      type:String,
      default:""
    } // added for label in nft card


    // createdAt               :   {   type:Date},
    // updatedAt               :   {   type:Date}


},{timestamps:true})

export default mongoose.model('tokenowners',NFTOwnerDetails)
