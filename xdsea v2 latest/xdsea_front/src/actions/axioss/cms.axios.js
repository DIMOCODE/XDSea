 
import config from '../../config/config.js'
import {axiosFunc, AppenData} from '../common'

export const Category    =   async   (data)  =>  {


    var senddata    =   {
        method  :   'GET',
        url     :   `${config.ADMIN_URL}/getcategory`,
        }
    let Resp    =   await axiosFunc(senddata)

    return Resp.data
}
export const Currency    =   async   (data)  =>  {
    var senddata    =   {
        method  :   'get',
        url     :   `${config.ADMIN_URL}/currencylist`
        }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}
export const USDPRICE = async (data) =>{
    var senddata ={
        'method': 'get',
        'url': `https://min-api.cryptocompare.com/data/price?fsym=${data}&tsyms=USD`,  
    }
    let Resp = await axiosFunc(senddata);
    
    return Resp.data?.USD;
}
export const TOKENPRICE = async (data) =>{
    var senddata ={
        'method': 'get',
        'url': `https://api.pancakeswap.info/api/v2/tokens/${data}`,  
    }
    let Resp = await axiosFunc(senddata);
    
    return Resp?.data?.data?.price;
}

export const getCmsContent  = async(data)=>{
    
    try{
        var resp = await axiosFunc({
          
                'method':'GET',
                'url':`${config.ADMIN_URL}/getcmslist`,
                'params':{data:data}
        })
        return resp.data;
    }
    catch(err){
        // console.log("err in gettok owner",err)
    }

}

 