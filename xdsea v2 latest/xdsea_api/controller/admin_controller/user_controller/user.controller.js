import userSchema from '../../../models/front_models/user.schema'
import Faq from '../../../models/admin_models/faq.schema'
import faqcontent from '../../../models/admin_models/faqcontents.schema'
import Subscribers from '../../../models/front_models/subscriber.schema'
import SocialLinks from '../../../models/front_models/social.schema'
import collection from '../../../models/front_models/collection.schema'
import { Find, Aggregate } from '../../../helper/mongooseHelper'
import config from '../../../config/serverConfig'
import nodemailer from 'nodemailer'
// get user details for admin panal userdetails
export const  getUserList = async(req,res)=>{
        var resp = await userSchema.find({})
        if(resp){
          res.status(200).json({"status":true,"data":resp})
        }
        else 
          res.status(200).json({"status":true,"data":resp})
      
  }  


  //-------------------------------------------
  export const  getFaqList = async(req,res)=>{
        var resp = await Faq.find({})
        if(resp){
          res.status(200).json({"status":true,"data":resp})
        }
        else 
          res.status(200).json({"status":true,"data":resp})
      
} 
  
//-------------------------------------
  export const AddEditDeleteFAq = async(req,res)=>{

    var data = req.body;

    if(data.action == "add"){

      var payload = {
        "question":data.question,
        "answer":data.answer
      }

      var faq = new Faq(payload);
      var resp = await faq.save()
      if(resp){
        res.status(200).json({"status":true,"msg":"faq added successfully!"})
      }else
        res.status(200).json({"status":false,"msg":"Cannot Add FAQ!"})


    }
    else if(data.action == "edit"){

      var resp = await Faq.findOneAndUpdate({"question":data.question},{"answer":data.answer},{new:true})
      if(resp){
        res.status(200).json({"status":true,"msg":"faq edited successfully!"})
      }else 
        res.status(200).json({"status":false,"msg":"Cannot edit FAQ!"})



    }else{
      var resp = await Faq.findOneAndDelete({"question":data.question})
      if(resp){
        res.status(200).json({"status":true,"msg":"FAQ deleted successfully!"})
      }else
        res.status(200).json({"status":false,"msg":"failed to delete"})

    }
  }

  export const  getFaqcontentsList = async(req,res)=>{
    
        var resp = await faqcontent.find({})
        if(resp){
          res.status(200).json({"status":true,"data":resp})
        }
        else 
          res.status(200).json({"status":true,"data":resp})
      
} 
  export const AddDelEditFAqcontent = async(req,res)=>{


    var data = req.body;

    if(data.action == "add"){

      var payload = {
        faqcontent:data.faqcontent,
       }

      var faq = new faqcontent(payload);
      var resp = await faq.save()
      if(resp){
        res.status(200).json({"status":true,"msg":"faq added successfully!"})
      }else
        res.status(200).json({"status":false,"msg":"Cannot Add FAQ!"})


    }
    else if(data.action == "edit"){
      var resp = await faqcontent.findOneAndUpdate({"_id":data.id},{"faqcontent":data.faqcontent},{new:true})
    
      if(resp){
        res.status(200).json({"status":true,"msg":"faq edited successfully!"})
      }else 
        res.status(200).json({"status":false,"msg":"Cannot edit FAQ!"})



    }else{
      var resp = await faqcontent.findOneAndDelete({"faqcontent":data.faqcontent})
      if(resp){
        res.status(200).json({"status":true,"msg":"FAQ deleted successfully!"})
      }else
        res.status(200).json({"status":false,"msg":"failed to delete"})

    }
    
  }

export const sociallinks = async(req,res)=>{
  var links = await MongooseHelper.Find({ DBName:SocialLinks, FinData :({})});
  
  res.json({"success":links.success,msg:links.msg});
}
export const FollowUnFollowFunc = async(req,res)=>{
  const {MyItemAddr,ClickAddr,From,MyItemCustomUrl,ClickCustomUrl} = req.body
 
  if(MyItemAddr&&ClickAddr){
      // remove follower
      var update = { $pull:{ Follower: { Address:ClickAddr,CustomUrl:ClickCustomUrl } }}
      var finVal = { DBName: userSchema, FinData: { $and:[{WalletAddress:MyItemAddr},{CustomUrl:MyItemCustomUrl},{Follower:{$elemMatch:{Address:ClickAddr,CustomUrl:ClickCustomUrl}}}] }, Updata:update , save: { new: true } }
      var Find = await MongooseHelper.FindOneAndUpdate(finVal)
     

      if(Find.success == "success"){
          //remove following
          var update_following = { $pull :{Following: { Address:MyItemAddr,CustomUrl:MyItemCustomUrl } }}
          var finVal_following = { DBName: userSchema, FinData: { $and:[{WalletAddress:ClickAddr},{CustomUrl:ClickCustomUrl},{Following:{$elemMatch:{Address:MyItemAddr,CustomUrl:MyItemCustomUrl}}}] }, Updata:update_following , save: { new: true } }
          var Find_following = await MongooseHelper.FindOneAndUpdate(finVal_following)
        
      if(Find_following.success == "success"){
          res.json({success : Find_following.success,msg:'unfollow'})}
      }
      else{
      // add follower

          var update = { $push:{ Follower: { Address:ClickAddr,CustomUrl:ClickCustomUrl }} }
          var finVal = { DBName: userSchema, FinData: { $and:[{WalletAddress:MyItemAddr},{CustomUrl:MyItemCustomUrl}] }, Updata:update , save: { new: true } }
          var Find = await MongooseHelper.FindOneAndUpdate(finVal)
         

          if(Find.success == "success"){
      // add following

          var update_following = { $push:{ Following: { Address:MyItemAddr,CustomUrl:MyItemCustomUrl } } }
          var finVal_following = { DBName: userSchema, FinData: { $and:[{WalletAddress:ClickAddr},{CustomUrl:ClickCustomUrl}] }, Updata:update_following , save: { new: true } }
          var Find_following = await MongooseHelper.FindOneAndUpdate(finVal_following)
        
         
      if(Find_following.success == "success"){
          res.json({success : Find_following.success,msg:'follow'})}
   
      }
  }
  }
  
  
}
export const  getSubscriberList = async(req,res)=>{
 
      var resp = await Subscribers.find({})
      if(resp){
       
        res.status(200).json({"status":true,"data":resp})
      }
      else 
        res.status(200).json({"status":true,"data":resp})
    
    
    }

export const SendMails = async(req,res) =>{
  
  let reqBody = req.body;
  let bodyOfContent = reqBody.boc;
  let subject = reqBody.subject;
  let subscribers = await Subscribers.find({ maySent: true }, { _id: 0, email: 1 });
 
  let length = subscribers.length, emails = '';
  subscribers.map((list, index) =>
    index == (length - 1) ?
      emails += list.email : emails += list.email + ", "
  )
  let data = await sendMailNodeMailer({ toEmail: emails, htmlContent: bodyOfContent, subject: subject || 'News Letter' });
  res.status(200).json({ Success: true, data: data });
  // if(Send_Mail) res.json ({"success" : "success"})
  // else res.json ({"success" : "error"})
}
  
export const AddSocialLinks = async(req,res)=>{
  try{
    var data = req.body;
   
  
    if(data.action == "add"){
     
      var check = await SocialLinks.findOne({"website":data.website})
  
      if(check){
        return  res.status(200).json({"status":false,"msg":"Already exists,click edit to change link"})
      }else{
    
        var social = new SocialLinks(data);
        
        var resp = await social.save()
        if(resp){
          
          res.status(200).json({"status":true,"msg":"social link added successfully!"})
        }else
          res.status(200).json({"status":false,"msg":"failed to add"})
      }
  
  
    }
    else if(data.action == "edit"){
     
  
      var resp = await  SocialLinks.findOneAndUpdate({"website":data.website},{"link":data.link})
      if(resp){
       
        res.status(200).json({"status":true,"msg":"social link upated successfully!"})
      }else
        res.status(200).json({"status":false,"msg":"failed to update"})
    }
    else{
  
      var resp = await SocialLinks.findOneAndDelete({"website":data.website})
      if(resp){
      
        res.status(200).json({"status":true,"msg":"social link deleted successfully!"})
      }else
        res.status(200).json({"status":false,"msg":"failed to delete"})
      
  
    }
  
  
      
  }
  catch(err){
   
    res.status(200).json({"status":false,"msg":"failed to add"})
     
  
  }
    
    
  
  
  }
  export const  getSocialLinks = async(req,res)=>{
   
        var resp = await SocialLinks.find({})
        if(resp){
          
          res.status(200).json({"status":true,"data":resp})
        }
        else 
          res.status(200).json({"status":true,"data":resp})
      
      
      }

  export const getDropList = async (req,res) => {
    // Find
    var query = [
      {
        $match:{}
      },
      {
        $lookup:{
          from: "tokens",
          let:{symbol:"$CollectionSymbol"},
          pipeline:[{$match:{$expr:{$eq:["$CollectionSymbol","$$symbol"]}}},
          {
            $count: "tokencount"
          }],
          as:"undercollection"
        }
      },
      {$unwind:"$undercollection"},
      {$project:{
        CollectionName:1,
        CollectionProfileImage:1,
        CollectionCoverImage:1,
        CollectionSymbol:1,
        CollectionBio:1,
        CollectionNetwork:1,
        CollectionCreator:1,
        Category:1,
        tokencount:"$undercollection.tokencount",
        _id:0,
        updatedAt:1,
      }}
      ];
    var Resp = await Aggregate({DBName:collection,Query:query})
    res.send(Resp)
  }

  const sendMailNodeMailer = async (payload) => {
   
    try {
      let reqBody = payload;
      let toEmail = reqBody.toEmail;
      let htmlContent = reqBody.htmlContent;
      let subject = reqBody.subject;
  
      if (toEmail == '' ||toEmail == undefined||toEmail == null)
        return { Success: true, Message: 'To email address must' };
      if (htmlContent == '' || htmlContent == undefined || htmlContent == null)
        return { Success: true, Message: 'Html content must' };
      if (subject=='' || subject==undefined || subject==null)
        return { Success: true, Message: 'Subject content must' };
  
        
      let transporter = nodemailer.createTransport(config.keyEnvBased.emailGateway.nodemailer);
     
      let info = await transporter.sendMail({
        from: config.keyEnvBased.emailGateway.nodemailer.auth.user,
        to: toEmail,
        subject: subject,
        html: htmlContent,
      });
     
      return { Success: true, Message: 'Mail sent successfully!' };
    } catch (error) {
     
      return { Success: false, Message: 'Oops something went wrong!' };
    }
  }
