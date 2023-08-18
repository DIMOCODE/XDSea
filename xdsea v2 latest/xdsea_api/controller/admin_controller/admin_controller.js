/// ---> Packagesaddcategory

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import config from '../../config/serverConfig'

//// ---- >> Models

import Admin from "../../models/admin_models/admin.schema"

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


