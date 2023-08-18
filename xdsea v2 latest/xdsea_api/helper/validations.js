import { FindOne } from "./mongooseHelper"
import UserSchema from '../app/schema/user.schema'
import { isEmpty } from "./commonFUnction"
import bcrypt from 'bcrypt'
export const User =  async(req,res,next)  =>  {
const { EmailId , Password } = req.body
var ValidateError = {}
const FIndAlreadyExits = await FindOne({DBName : UserSchema,FinData:{EmailId:EmailId},SelData:{}})
console.log("sadsa",req.body,FIndAlreadyExits)
if(!FIndAlreadyExits) ValidateError.EmailId = "EmailId Does Not Exits"
else{
    const pass = await bcrypt.compare(Password,FIndAlreadyExits.msg.Password)
    if(!pass) ValidateError.Password = "Enter Correct Password"
}
if(isEmpty(ValidateError)) next()
else return res.json({'success':'error',msg:ValidateError})
}