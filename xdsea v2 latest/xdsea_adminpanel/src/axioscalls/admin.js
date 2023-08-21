import axios from 'axios';
import config from "../lib/config.js";


export const loginAdmin = async(payload)=>{
    let data = {"data":payload}
    try{
        const resp = await axios({
            'method':'POST',
            'url':`${config.AdminAPI}/adminlogin`,
            'data':data
            
        })
        if(resp.data.token)
            localStorage.setItem("token",resp.data.token);

        return resp.data;
    }
    catch(err){
        return false
    }


}


export const check  = async()=>{

    try{
    var data = {"test":"testdata"}
    var resp = await axios({
        "method":"POST",
        'url':`${config.AdminAPI}/checkroute`,
        "data":data,
        "headers":{
            "Authorization":localStorage.getItem("token")
        }
    })

    }
    catch(err){
        return false
    }

}