import Token from '../../../models/front_models/token.schema'
import Nfttags from '../../../models/front_models/nfttag.schema'
import {Find, FindOne, FindOneAndUpdate, Save ,TokenList} from '../../../helper/mongooseHelper'
import {isEmpty} from '../../../helper/commonFUnction'
import EmailTemplate from '../../../models/admin_models/emailtemplates.schema'
import Cms from '../../../models/admin_models/cms.schema'
import Currency from '../../../models/admin_models/currency.schema'
import TokenOwner from '../../../models/front_models/tokenowner.schema'
import usercollection from "../../../models/front_models/collection.schema.js"
import * as MongooseHelper from '../../../helper/mongooseHelper'


export const getReportTokens = async(req,res)=>{

  // var data={}   //  find match
  var resp = await Token.find({reported:true},{NFTId :1,NFTName:1,Category:1,NFTOrginalImage:1,ContractAddress:1,ContractType:1,CollectionNetwork:1, MetaData:1,reported:1,ReportBy:1,updatedAt:1,HideShow:1})
  if(resp){
    res.status(200).json({"status":true,"data":resp})
  }
  else 
    res.status(200).json({"status":true,"data":resp})


}
export const ManageReportToken = async(req,res)=>{
    var data = req.body;
  var {NFTId,ContractAddress,ContractType,CollectionNetwork,reported,HideShow}=req.body
  try{
      var resp = await Token.findOneAndUpdate({NFTId,ContractAddress,ContractType,CollectionNetwork,reported},{$set:{"HideShow":(HideShow == "" || HideShow == "visible")?"Hidden":"visible"}},{new:true})

      if(resp){
        res.status(200).json({"status":"success"})
        
      }
  }
  catch(err){
    console.log("err",err)
  }
  
  
  }
  export const getTokenReportStatus = async(req,res)=>{
  try{
    var resp = await Token.findOne({"NFTId":req.query.NFTId})
    if(resp){
      var data = {reported:resp.reported}
      res.status(200).json({"Status":true,"data":data})
    }else{
      res.status(200).json({"Status":false,"data":{}})
  
    }
  }catch(err){console.log('kjsdf',err)}
    
  }

  export const getnfttaglist = async(req,res)=>{
  
    var resp = await Nfttags.find({})
  
    if(resp){
      res.status(200).json({"status":true,"data":resp})
    }
    else{
      res.status(200).json({"status":false,"data":[]})
      
    }
  }
  
export const EditNFtTags = async(req,res)=>{

  var resp = await Nfttags.findByIdAndUpdate({_id:req.body.id},{nfttag:req.body.nfttag},{new:true})
  if(resp){
    res.status(200).json({"status":true,"msg":"nfttag updated successfully!"})
  }
  else{
    res.status(200).json({"status":false,"msg":"nfttag updation failed !"})

  }

}
export const getEmailTemplateList  = async(req,res)=>{
  try{
    var find={ DBName : EmailTemplate , FinData : {} , SelData : '' , limit : 10000 , skip : 0}
    var resp = await Find(find);
    if(resp){
      res.json({"success": resp.success , "data" : resp.msg});
    
    }
    else{
      res.json({"success": resp.success , "data" : resp.msg});
    
    }
  }catch(err){console.log("gettt",err)}
}


export const editEmailTemplateList = async(req,res)=>{
  try{
    var upddata = {Content:req.body.Content};
    var finVal ={  DBName : EmailTemplate, FinData:{Type :req.body.Type}, Updata:upddata, save:{new:true}} 
    var resp = await FindOneAndUpdate(finVal);
    if(resp){
      res.json({"success":resp.success})
    }
    else{
      res.json({"success":resp.success});
    }
  }catch(err){console.log('eetlll',err)}
}

export const getCmsList = async(req,res)=>{

  if(!isEmpty(req.query.data)) {
    var finds = {slug:req.query.data}
    var resp = await Cms.findOne(finds)
    if(resp){
      res.status(200).json({"status":true,"data":resp})
    }
    else 
      res.status(200).json({"status":true,"data":resp})
  
  }
  else{
    var resp = await Cms.find({})
  if(resp){
    res.status(200).json({"status":true,"data":resp})
  }
  else 
    res.status(200).json({"status":true,"data":resp})

  }
  

}

export const editcms = async(req,res)=>{

  var resp = await Cms.findOneAndUpdate({"question":req.body.question},{"answer":req.body.answer,"link":req.body.link},{new:true});
  if(resp){
    res.status(200).json({"status":true,"msg":"cms updated successfully"})
  }
  else 
    res.status(200).json({"status":false,"msg":"cms updation failed"})

  


}
export const Tokenlistcheck  =   async(req,res)  =>  {
  const { TabName ,limit ,ProfileUrl ,page ,from } = req.query 
  var SendDta =   {}
  SendDta.limit = parseInt(limit) ?? 1
  SendDta.skip   =   ((page ? parseInt(page) : 1 ) - 1) * limit
  SendDta.ProfileUrl = ProfileUrl;
  SendDta.from = from
  SendDta.tokenOwnerMatch = {
      $expr:{ '$and':[
          
          { '$eq':['$HideShow', 'visible' ]},
          { '$eq':['$NFTId','$$tId']},
      ]
      }
  }
  SendDta.Tokens = Token;
  SendDta.TokenMatch    =   {};
  SendDta.sort = {'tokenowners_list.updatedAt':-1}
  
         
      
  var TabNames = (TabName == 'All' || TabName == 'LatestDrops' || TabName == 'PriceLowToHigh' || TabName == 'PriceHighToLow')  ? '' :TabName ;
  SendDta.TokenMatch    =   {
    'Category': TabNames ? TabNames : { '$ne': '' }
  }
  SendDta.sort = {'tokenowners_list.updatedAt':-1}
  var RetData = await TokenList(SendDta);
  
  res.json(RetData)

}



export const AddToken = async(req,res)=>{
  
if(req.body.action == "add"){
  
  var token  = await Currency.find({CurrencyDetails: {$elemMatch: {label:req.body.name}}},  { "CurrencyDetails.$": 1})
  
  if(token && token.length > 0){
 
  return res.status(200).json({"status":false,"msg":"Token Already Exists"})
  }else {
    var data = {
    "label":req.body.name,
    "value":req.body.name,
    "address":req.body.address,
    "decimal":req.body.decimal,
    "deleted":0
  }


  var resp = await Currency.findOneAndUpdate({},{ $push: { CurrencyDetails: data } },{new:true})
  if(resp){
    
    res.status(200).json({"Status":true,"msg":"Token Added Successfully!"})

  } 
  else res.status(200).json({"Status":false,"msg":"Token Inclusion Failed"})

  }
}else{
  var resp = await deleteToken(req.body);
  if(resp) 
    res.status(200).json({"status":true,"msg":"Token visibility changed!"})
  else 
    res.status(200).json({"status":false,"msg":"Token deletion Failed !"})

}
  
  
}

const deleteToken = async(data)=>{
  
   var resp = await Currency.findOneAndUpdate({"CurrencyDetails.value": data.label},
                                              {$set : {"CurrencyDetails.$.deleted" : !data.deleted}},{new:true})
  if(resp){
    
    return true;

  }else{
    return false;
  }
}

export const getCurrencyList = async(req,res)=>{

  let data = {
    DBName: Currency, FinData: {}, SelData: { _id: 0 }
  }
  let List = await MongooseHelper.Find(data)
  res.json(List)
}


export const getTokenOwner = async(req,res)=>{
  var tokenId = req.query.TokenId;
  try{
    var tokenOwner = await TokenOwner.findOne({"TokenId":tokenId});
    
    if(tokenOwner){
     var owner = tokenOwner.TokenOwner;
      res.status(200).json({"status":true,"TokenOwner":owner})
    }
    else{
     res.status(200).json({"status":false,"TokenOwner":{}})

    }
  }catch(err){
    res.status(200).json({"status":false,"TokenOwner":{}})

  }
}


export const BannerPromotionAction = async(req,res)=>{
 
  var message;
  if(req.body.promotionStatus == false){
    var newpromotion = await TokenOwner.findOneAndUpdate({NFTId : req.body.NFTId},{$set:{"bannerpromotion":false}},{new:true})
    message = "Promotion Removed Successfully"
  }
  else if(req.body.promotionStatus == true){
    var newpromotion = await TokenOwner.findOneAndUpdate({NFTId : req.body.NFTId},{$set:{"bannerpromotion":true}},{new:true})
    message = "Promotion Updated Successfully"
  }
  
  if(newpromotion){
    res.json({"status":true,"promotedtoken":newpromotion,"message":message})
  }
  else{
    res.json({"status":false,"promotedtoken":newpromotion,"message":message})
  }
  
}

export const GetCollectionlist = async (req, res) => {
  try {
    
    var SendData = {
      DBNAME: usercollection,
    };
    var RetData = await MongooseHelper.CollectionList(SendData);
   
    RetData.promotion = await usercollection.find({ bannerpromotion: true }).count();
    RetData.dropPromotionCount = await usercollection.find({ droppromotion: true }).count();
    RetData.stackpromotionCount = await usercollection.find({ stackpromotion: true }).count();
    res.json(RetData)
  }
  catch (err) {
    
    res.json({ "status": false, "data": null })
  }
}

export const CollectionPromotionAction = async (req, res) => {
  
  const { from } = req.body
  try {
    var message;
    let finData = { customUrl: req.body.customUrl }
    if (req.body.promotionStatus == false) {
      let upData = from == "drop" ? { $set: { "droppromotion": false } } : from == "stack" ? { $set: { "stackpromotion": false } } : { $set: { "bannerpromotion": false } }
      var newpromotion = await usercollection.findOneAndUpdate(finData, upData, { new: true })
      message = "Promotion Removed Successfully"
    }
    else if (req.body.promotionStatus == true) {
      let upData = from == "drop" ? { $set: { "droppromotion": true } } : from == "stack" ? { $set: { "stackpromotion": true } } : { $set: { "bannerpromotion": true } }
      var newpromotion = await usercollection.findOneAndUpdate(finData, upData, { new: true })
      message = "Promotion Updated Successfully"
    }
    var checkcoll = await usercollection.find({ customUrl: req.body.customUrl });
   
    if (newpromotion) {
      res.json({ "status": true, "promotedtoken": newpromotion, "message": message })
    }
    else {
      res.json({ "status": false, "promotedtoken": newpromotion, "message": message })
    }
    
  }
  catch (err) {
    console.log(err);
  }
} 