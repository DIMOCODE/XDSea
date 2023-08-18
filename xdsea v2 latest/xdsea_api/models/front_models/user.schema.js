import mongoose, { Schema,model } from "mongoose";
const userdetails  =   Schema({
    _id             :   {   type : String , required: true},
    DisplayName     :   {   type : String , default : ''},
    EmailId         :   {   type : String , default : ''},
    Youtube         :   {   type : String , default : ''},
    Facebook        :   {   type : String , default : ''},
    Twitter         :   {   type : String , default : ''},
    Instagram       :   {   type : String , default : ''},
    WalletAddress   :   {   type : String , default : ''},
    WalletType      :   {   type : String , default : ''},
    Profile         :   {   type : String , default : ''},
    ThumbnailProfile         :   {   type : String , default : ''},
    Cover           :   {   type : String , default : ''},
    Bio             :   {   type : String , default : ''},
    CustomUrl       :   {   type : String , default : ''}, //username
    Follower        :   {   type    :   Array,default   :   [{
        Address     :   '',
        CustomUrl  :   ''
    }]},
    Following       :   {   type    :   Array,default   :   [{
        Address     :   '',
        CustomUrl  :   ''
    }]},
    isReported     :{   type:String , default:false   }
   
},{timestamps:true})

export default mongoose.model('users',userdetails)
