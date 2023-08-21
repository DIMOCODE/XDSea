import axios  from "axios"
import config from '../lib/config.js'


// purpose -- to get tokenlist  from db for listing before minting

export const getTokenList = async()=>{

    try{
        const resp = await axios({
            'method':'GET',
            'url':`${config.AdminAPI}/token/gettokens`,
            
        })

        return resp.data;
    }
    catch(err){
        return false
    }

}



export const mintDbUpdate = async(payload)=>{
    var data = {"data":payload}
    
    try{
        var resp = await axios({
            "method":"POST",
            "url":`${config.AdminAPI}/token/afterMintUpdate`,
            "data":payload,
            "headers":{
                "Authorization":localStorage.getItem("token")
            }
        })

        return resp.data;
    }
    catch(err){
        return false
    }

}


export const marketTokens = async()=>{

    try{
        const resp = await axios({
            'method':'GET',
            'url':`${config.AdminAPI}/token/getMarketTokens`,
            
        })

        return resp.data;
    }
    catch(err){
        return false

    }

}


export const hideOrShowToken = async(data)=>{
    try{
        var resp = await axios({
            "method":"POST",
            "url":`${config.AdminAPI}/token/hideshowtokens`,
            "headers":{
                "Authorization":localStorage.getItem("token")
            },
            "data":data,

        })

        return resp.data;
    }
    catch(err){
        return false
    }
  
}


export const getTokenOwner  = async(data)=>{
    var data = {TokenId:data}

    try{
        var resp = await axios({
          
                'method':'GET',
                'url':`${config.AdminAPI}/getOwner`,
                'params':data
     
    
        })
        return resp.data;
    }
    catch(err){
        return false
    }
}


export const getShowStatus  = async(data)=>{
    

    try{
        var resp = await axios({
          
                'method':'GET',
                'url':`${config.AdminAPI}/token/getHideShow`,
                'params':data
     
    
        })
        return resp.data;
    }
    catch(err){
        return false
    }
}


export const addCategoryCall = async(data)=>{


    var formData = new FormData();
    formData.append("name",data.name)
    formData.append("description",data.description)
    formData.append("categoryimage",data.categoryimage)
    formData.append("action",data.action)



    try{
        var resp = await axios({
            "method":"POST",
            "url":`${config.AdminAPI}/addcategory`,
            "headers":{
                "Content-Type": "multipart/form-data",
                "Authorization":localStorage.getItem("token")
            },
            "data":formData,

        })

        return resp.data;
    }
    catch(err){
        return false
    }
  
}

export const getCatList  = async()=>{
    
    try{
        var resp = await axios({
          
                'method':'GET',
                'url':`${config.AdminAPI}/getcategory`,
        })
        return resp.data;
    }
    catch(err){
        return false
    }
}

export const hideShowCat = async(data)=>{
    try{
        var resp = await axios({
            "method":"POST",
            "url":`${config.AdminAPI}/hideshowcategory`,
            "headers":{
                "Authorization":localStorage.getItem("token")
            },
            "data":data,
        })

        return resp.data

    }catch(err){
        return false
    }
}


export const addTokenCall = async(data)=>{
    try{
        var resp = await axios({
            "method":"POST",
            "url":`${config.AdminAPI}/addtoken`,
            "headers":{
                "Authorization":localStorage.getItem("token")
            },
            "data":data,
        })

        return resp.data
    }
    catch(err){
        return false
    }
}


export const getCurrencyList  = async()=>{
    
    try{
        var resp = await axios({
          
                'method':'GET',
                'url':`${config.AdminAPI}/currencylist`,
        })
        return resp.data;
    }
    catch(err){
        return false
    }
}



export const editCmsCall = async(data)=>{
    try{
        var resp = await axios({
            "method":"POST",
            "url":`${config.AdminAPI}/editcms`,
            "headers":{
                "Authorization":localStorage.getItem("token")
            },
            "data":data,
        })

        return resp.data
    }
    catch(err){
        return false
    }
}



export const getCmsContent  = async(data)=>{
    
    try{
        var resp = await axios({
          
                'method':'GET',
                'url':`${config.AdminAPI}/getcmslist`,
                params:data
        })
        return resp.data;
    }
    catch(err){
        return false
    }
}



export const getBurnTokens  = async()=>{

    try{
        var resp = await axios({
          
                'method':'GET',
                'url':`${config.AdminAPI}/token/getburntokens`
     
    
        })
        return resp.data;
    }
    catch(err){
        return false
    }
}


export const getReportTokens  = async()=>{

    try{
        var resp = await axios({
          
                'method':'GET',
                'url':`${config.AdminAPI}/getreporttokens`
     
    
        })
        return resp.data;
    }
    catch(err){
        return false
    }
}



export const manageReportToken = async(data)=>{
    try{
        var resp = await axios({
            "method":"POST",
            "url":`${config.AdminAPI}/managereporttoken`,
            "headers":{
                "Authorization":localStorage.getItem("token")
            },
            "data":data,
        })

        return resp.data
    }
    catch(err){
        return false
    }
}



export const tokenReportStatus  = async(data)=>{

    try{
        var resp = await axios({
          
                'method':'GET',
                'url':`${config.AdminAPI}/getreportoftoken`,
                'params':data
    
        })
        return resp.data;
    }
    catch(err){
        return false
    }
}

/**  */

export const getDropList = async()=>{
    try{
        const resp = await axios({
            'method':'GET',
            'url':`${config.AdminAPI}/token/getDropList`,
            
        })
        return resp.data;
    }
    catch(err){
        return false
    }

}


export const ApproveCAll = async(data)=>{
    try{
        const resp = await axios({
            'method':'post',
            'url':`${config.AdminAPI}/token/ApproveCAll`,
            'data':data
            
        })
        return resp.data;
    }
    catch(err){
        return false
    }

}

export const CreateLazyMint    =   async   (data)  =>  {
    const resp = await axios({
        method  :   'post',
        url     :   `${config.AdminAPI}/token/CreateLazyMint`,
        data    :   data,
        
        })
        return resp.data;

}

export const getemailTemplateList = async() => {
    const resp = await axios({
        method : 'get',
        url    : `${config.AdminAPI}/getemailtemplate`
    })
    return resp.data;
}

export const editemailTemplateList = async(data) => {
    const resp = await axios({
        method : 'post',
        url    : `${config.AdminAPI}/editemailtemplate`,
        data   : data,
    })
    return resp.data;

}
export const BannerPromotionAction = async(data) =>{
    const resp = await axios({
        method : 'post',
        url    : `${config.AdminAPI}/bannerpromotionaction`,
        data   : data,
    })
    return resp.data;
}

export const CollectionPromotionAction = async(data) =>{
    const resp = await axios({
        method : 'post',
        url    : `${config.AdminAPI}/collectionpromotionaction`,
        data   : data,
    })
    return resp.data;
}
