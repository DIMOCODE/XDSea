 
import config from '../../config/config'
import {axiosFunc, AppenData} from '../common'

// Common Formdata function

// const AppenData = (data) =>{
//     var formdata = new FormData()
//     var SendDta = Object.entries(data).map((item)=>{
//         if(Array.isArray(item[1])){
//           var come=  item[1].map(data=>{
//                 formdata.append(item[0],data)
//             return formdata
//             })
//             return come
        
//         }
//         else{
//             formdata.append(item[0],item[1])
//             return formdata
//         }
//     })
//  return SendDta
// }

// Common Axios Function
// const axiosFunc    =   async   (data)  =>  {
//     try{
//         let Resp    =   await axios(data)
//         return Resp
//     }
//     catch(e){
//         return {success:'error',msg:null}
//     }
// }

//user ProfileCreate, Update axios Function 
export const userRegister    =   async   (data)  =>  {
     
    var formdata = AppenData(data)
    var senddata    =   {
        method  :   'post',
        url     :   `${config.BACK_URL}/user/create`,
        data    :   formdata[0],
        'headers': {
            'Content-Type': 'multipart/form-data',
            // 'Authorization': token
          }
    }
    
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

export const Token_MyList_Func    =   async   (data)  =>  {
    var senddata    =   {
        method  :   'GET',
        url     :   `${config.BACK_URL}/nft/myItemList`,
        params  :   data
        }
    let Resp    =   await axiosFunc(senddata)

    return Resp.data
}

export const CheckUrl    =   async   (data)  =>  {
    var senddata    =   {
        method  :   'GET',
        url     :   `${config.BACK_URL}/nft/checkurl`,
        params  :   data
        }
    let Resp    =   await axiosFunc(senddata)

    return Resp.data
}



export const FollowUnFollowFunc = async (data) =>{
    var senddata ={
        method  :   'POST',
        url     :   `${config.BACK_URL}/user/FollowUnFollowFunc`,
        data    :    data,
        // 'headers': {
        //     'Authorization': token
        //   }
    }
    let Resp = await axiosFunc(senddata);
    
    return Resp.data;
}

export const getFollowStatus = async (data) =>{
    var senddata ={
        method  :   'GET',
        url     :   `${config.BACK_URL}/user/getfollowstatus`,
        params  :    data
    }
    let Resp = await axiosFunc(senddata);
    
    return Resp.data;
}

export const GetLikeDataAction = async (data) => {
    var senddata = {
        method : 'POST',
        url    : `${config.BACK_URL}/nft/like/list`,
        data   :   data
    }
    let Resp   = await axiosFunc(senddata)
    return Resp.data
}

export const AddLikeAction = async (data) => {
    var senddata = {
        method : 'POST',
        url    : `${config.BACK_URL}/nft/like`,
        data   :   data,
        // 'headers': {
        //     'Authorization': token
        //   }
    }
    let Resp   = await axiosFunc(senddata)
    return Resp.data
}

export const findOwners= async (data)=>{
    var senddata = {
        method : 'GET',
        url    : `${config.BACK_URL}/nft/findOwners`,
        params:data
       
    }
    let Resp   = await axiosFunc(senddata)
    return Resp.data
}

export const Newsletter = async (data) =>{
    var senddata ={
        method  :   'POST',
        url     :   `${config.BACK_URL}/user/newsletter`,
        data    :    data
    }
    let Resp = await axiosFunc(senddata);
    
    return Resp.data;
}

export const Report = async (data) =>{
    var senddata ={
        'method': 'post',
        'url':  `${config.BACK_URL}/token/report`,
        data:data
    }
    let Resp = await axiosFunc(senddata);
    
    return Resp?.data;
}
// report
export const report = async (data) =>{
    var senddata ={
        'method': 'post',
        'url':  `${config.BACK_URL}/nft/report`,
        data:data
    }
    let Resp = await axiosFunc(senddata);
    
    return Resp?.data;
}

export const Sociallinks = async() =>{
    
    var senddata ={
        method  :  'get',
        url     :  `${config.BACK_URL}/user/social`
    }
    let Resp = await axiosFunc(senddata);
    
    return Resp.data;
}


export const getFaqList  = async()=>{
    
    try{
        var resp = await axiosFunc({
          
                'method':'GET',
                'url':`${config.ADMIN_URL }/getfaqlist`,
        })
        return resp.data;
    }
    catch(err){
        // console.log("err in gettok owner",err)
    }
}