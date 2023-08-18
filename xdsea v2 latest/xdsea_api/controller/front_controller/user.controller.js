import * as MongooseHelper from '../../helper/mongooseHelper'
import * as commonFun from '../../helper/commonFUnction'
import { ImageAddFunc,UploadToBucket } from '../../helper/commonFUnction'

// --- > Models
import userSchema from '../../models/front_models/user.schema'
import subscribers from '../../models/front_models/subscriber.schema'
import Sociallinks from '../../models/front_models/social.schema'






export const UserRegister = async (req, res) => {
    var { Type, WalletAddress, WalletType, EmailId, DisplayName, Profile, Cover, Youtube, Facebook, Twitter, Instagram, Bio, CustomUrl,Website } = req.body
    if(req.files){
       var profile = req?.files?.Profile ? await UploadToBucket({
        path:`user/${WalletAddress}/profile/${Date.now() + '.' + req.files.Profile.name.split('.')[req.files.Profile.name.split('.').length - 1]}`,
        contenttoupload:req?.files?.Profile.data,
        contenttype:"image/*"
       }):null

       var cover = req?.files?.Cover ? await UploadToBucket({
        path:`user/${WalletAddress}/cover/${Date.now() + '.' + req.files.Cover.name.split('.')[req.files.Cover.name.split('.').length - 1]}`,
        contenttoupload:req?.files?.Cover.data,
        contenttype:"image/*"
       }):null
       
     }
   var saveData = {
       DisplayName: DisplayName,
       EmailId: EmailId,
       Youtube: Youtube,
       Facebook: Facebook,
       Twitter: Twitter,
       Instagram: Instagram,
       Bio: Bio,
       CustomUrl: CustomUrl,
       Profile: profile ?? Profile,
       Cover: cover ?? Cover,
       WalletAddress: WalletAddress,
       WalletType: WalletType,
       Website:Website
   }
   var FinData = {};
   if (Type == 'InitialConnect') {
       if (WalletAddress) {
           var FinData = { WalletAddress: WalletAddress }
       }
       else {
           res.json({ success: "error", msg: "Address Empty" })
       }
       if (!commonFun.isEmpty(FinData)) {
           const FIndAlreadyExits = await MongooseHelper.FindOne({ DBName: userSchema, FinData: FinData,SelData:{} })
           if (FIndAlreadyExits.success === "success") {
               res.json({ success: "success", data: FIndAlreadyExits.msg, msg: ` Connected successfully` })
           }
           else {
               saveData._id = WalletAddress;
               saveData.CustomUrl = WalletAddress;
               const savedata = await MongooseHelper.Save({ DBName: userSchema, Data: saveData })
               if (savedata.success === "success") {
                   res.json({ success: "success", data: savedata.msg, msg: `connected successfully` })
               }
               else {
                   res.json({ success: "error", msg: "Can't Save WalletAddress" })
               }
           }
       }
   }
   else if(Type == 'getProfile'){
       if(CustomUrl){
           FinData   =   {CustomUrl:CustomUrl}
       }
       else{
           res.json({ success: "error", msg: "Custom Url Empty" })
       }
       if(!commonFun.isEmpty(FinData)){
           const FIndAlreadyExits = await MongooseHelper.FindOne({ DBName: userSchema, FinData : FinData ,SelData:{}});
           if (FIndAlreadyExits.success === "success") {
               res.json({ success: "success", data: FIndAlreadyExits.msg, msg: `connected successfully` })
           }
           else {
               res.json({ success: "error", msg: "User Not Found" })
           }
       }
   }
   else if(Type == 'profile'){
       var FinData   =   {WalletAddress:WalletAddress};
       var finVal = { DBName: userSchema, FinData:FinData, Updata: { $set: saveData }, save: { new: true } }
       const Finddata = await MongooseHelper.FindOneAndUpdate(finVal)
       res.json({success:Finddata.success=="success"?"success":'error',data:Finddata.msg,msg:Finddata.success=="success"?`Updated Successfully`:'updation failed'})
   }
   else if(Type == 'cover'){
       var FinData   =   {CustomUrl:CustomUrl};

       const customExits = await MongooseHelper.FindOne({DBName : userSchema,FinData:{CustomUrl : CustomUrl },SelData:{CustomUrl:1,EmailId:1}})
       var finVal = { DBName: userSchema, FinData: { CustomUrl: CustomUrl }, Updata: { $set: saveData }, save: { new: true } }
       const Finddata = await MongooseHelper.FindOneAndUpdate(finVal)  
       res.json({success:Finddata.success=="success"?"success":'error',data:Finddata.msg,msg:Finddata.success=="success"?`Cover Image Updated Successfully`:'updation failed'})
   }
   else if(Type == 'profileimage'){
       var FinData   =   {CustomUrl:CustomUrl};
       var finVal = { DBName: userSchema, FinData: { CustomUrl: CustomUrl }, Updata: { $set: {Profile:saveData.Profile} }, save: { new: true } }
       const Finddata = await MongooseHelper.FindOneAndUpdate(finVal)  
       res.json({success:Finddata.success=="success"?"success":'error',data:Finddata.msg,msg:Finddata.success=="success"?`Profile Image Updated Successfully`:'updation failed'})
   }

}
export const Newsletter = async(req,res)=>{
    var email = req.body.email;
    var Exists = await MongooseHelper.FindOne({ DBName : subscribers , FinData:{email : email},SelData:{} });
    if(Exists.success=='success'){
        res.json({"success":"error",msg:"Email Id already exists"})
    }
    else{
        var new_subscriber=await MongooseHelper.Save({ DBName : subscribers , Data:{email:email}});
        res.json({"success":new_subscriber.success,msg:new_subscriber.success});
    }
    
}


export const sociallinks = async(req,res)=>{
    
    var links = await MongooseHelper.Find({ DBName:Sociallinks, FinData :({})});
    res.json({"success":links.success,msg:links.msg});
  }
