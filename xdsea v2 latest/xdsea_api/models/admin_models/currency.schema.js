import {Schema,model} from 'mongoose'

const currency  =   new Schema({
    CurrencyDetails       :   {   type : Array , default : []},
},{timestamps:true})

module.exports = model('currency',currency)