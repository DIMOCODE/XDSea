

/// ---> Packages

import * as MongooseHelper from '../../../helper/mongooseHelper'
import Category from '../../../models/admin_models/category.schema'
import Admin from "../../../models/admin_models/admin.schema"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from '../../../config/serverConfig'
import fs from "fs";

export const loginAdmin = async(req,res)=>{
    
    var ReqBody = req.body.data;
   
    if(ReqBody && ReqBody.path == "login"){

     
        var checkPassword  = ReqBody.password;
        
        var user = await Admin.findOne({email:ReqBody.email})
        if(user){
           
            const match = await bcrypt.compare(checkPassword, user.hashpassword);
            if(match){
                var payload = {"mail":ReqBody.email,"password":ReqBody.password}
                

                var tokenhash = jwt.sign(payload,config.SECRET_KEY)
                var token  = `Bearer ${tokenhash}`

               
                res.status(200).json({"msg":"successfully logged in","data":true,"token":token})
            }
            else{
                res.status(200).json({"msg":"incorrect password","data":false})
            }

        }else{ res.status(200).json({"msg":"user not found","data":false})}

    }
    else if(ReqBody && ReqBody.path == "register"){


       
      
    }
 
 
}


export const verifydata = async(req,res)=>{
   
}




//Get Category List
export const getCategoryList = async(req,res)=>{
    
    try{
      var catList = await Category.find()
      if(catList){
       
        res.status(200).json({"status":true,"data":catList})
      }else{
        res.status(200).json({"status":false,"data":[]})
      }
    }
    catch(err){console.log("err",err)}
}




// export const CurrencyList = async (req, res) => {
//     let data = {
//         DBName: Currency, FinData: {}, SelData: { _id: 0 }
//     }
//     let List = await MongooseHelper.Find(data)
//     res.json(List)
// }

export const AddCategory = async(req,res)=>{
 
  try{
    if(req.body.action != "edit"){
 
      var FindData = {DBName:Category,FindData:{"name":req.body.name},SelData:{"name":1}}
      var isExists = await Category.findOne({"name":req.body.name});
     
      if(isExists) 
          res.status(200).json({"status":false,"msg":"Category Already Exists"})
      else{

         var imagename = req.body.name.replace(/\s/g, '')+String(Date.now())+".webp"
         var upload_path = 'public/categoryimage/'+imagename
         req.body.image = imagename

         await fs.mkdir('public/categoryimage' , { recursive: true }, async function (err) {
          if (err) return;
          else{
            req.files.categoryimage.mv(upload_path,async function (err,data) {
                          if (err) return;
                          else {
                            
                            var save_data = {"name":req.body.name,"description":req.body.description,"image":req.body.image}
                            var querydata = {DBName:Category,Data:save_data}
                            var category = await MongooseHelper.Save(querydata)
                          
                            if(category){
                              
                              res.status(200).json({"status":true,"msg":"Category added successfully"})
                            }
                            else 
                              res.status(200).json({"status":false,"msg":"Category addition Failed"})
                          }
                        });
          }
        
   
        
        });

      }
  
    }else{

     

      var imagename = req.body.name.replace(/\s/g, '')+String(Date.now())+".webp"
      var upload_path = 'public/categoryimage/'+imagename


      await fs.mkdir('public/categoryimage' , { recursive: true }, async function (err) {
        if (err) return;
        else{
          req.files.categoryimage.mv(upload_path,async function (err,data) {
                        if (err) return;
                        else {
                      
                          var category = await Category.findOneAndUpdate({"name":req.body.name},{"image":imagename},{new:true});
                        
                          if(category){
                           
                            res.status(200).json({"status":true,"msg":"Category Image Edited Successfully"})
                          }
                          else 
                            res.status(200).json({"status":false,"msg":" Failed To Upload Image"})
                        }
                      });
        }
      
 
      
      });

 
    }
  
 
  }
  catch(err){
    
    res.status(200).json({"status":false,"msg":"Category addition Failed"})

  }

}


export const HideShowCategory = async(req,res)=>{
  


  var updatedCategory = await Category.findOneAndUpdate({"name":req.body.catName},{"hideShow":req.body.hideShow},{new:true});
   if(updatedCategory) 
      res.status(200).json({"status":true,"msg":"category visibility changed"})

   else res.status(200).json({"status":false,"msg":"failed to change"})
}

