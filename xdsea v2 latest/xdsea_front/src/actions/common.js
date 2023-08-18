 
import axios from 'axios'
import Config from '../config/config'

export const isEmpty = value =>
value === undefined ||
value === null ||
(typeof value === 'object' && Object.keys(value).length === 0) ||
(typeof value === 'string' && value.trim().length === 0) ||
(typeof value === 'string' && value === '0')||
(typeof value === 'number' && value === 0);



export const USDVALUE = (num,digits,coin)=> {
  // console.log('dfjkhkdfhjkfd',currency)
  // var digit = coin ? currency.filter((item)=>item.label == coin)?.pop()?.usd ?? 1:digits
  // num = (digit*num).toString().replace(/[^0-9.]/g, '');
  // if (num < 1000) {
  //     return String(num).includes('.00') ? num :  String(num).includes('.')?Number(num).toFixed(5):num;
  // }

  let si = [
    {v: 1E3, s: "K"},
    {v: 1E6, s: "M"},
    {v: 1E9, s: "B"},
    {v: 1E12, s: "T"},
    {v: 1E15, s: "P"},
    {v: 1E18, s: "E"}
    ];
  let index;
  for (index = si.length - 1; index > 0; index--) {
      if (num >= si[index].v) {
          break;
      }
  }
 
  var d=((num / si[index].v))? ((Number(num / si[index].v).toFixed(2)) + si[index].s):'0';
  return (d)
}
// Address cut function like 0x123...345
export const address_showing=(item)=>{
    if(item&&item.toString().length>10){
    var slice_front = item.slice(0,9)
    var slice_end  = item.slice(item.length-9,item.length-1)
    return slice_front+'....'+slice_end
    }
    else return item
}

// Copy Text
export const copydata = (data) =>{
    var copyText = data;
      return navigator?.clipboard?.writeText(copyText);
     //toast.success("Copied Successfully")
}

export const NumANdDotOnly = (data) => {
  var data = data.toString()
 var str = data ? data.includes('.') ? data.split('.').length >=3 ? (data.split('.')[0] + '.' + data.split('.')[1]).toString() : data : data : data
   return str.toString().replace(Config.NumDigitOnly,'')
 }

export const NumberOnly = (data) => {
  return data.toString().replace(Config.NumberOnly,'')
}

// Common Formdata function
export const AppenData = (data,isBulkmint) =>{
  var formdata = new FormData()

  if(!isBulkmint){
  var SendDta = Object.entries(data).map((item)=>{

      if(Array.isArray(item[1])){
        var come=  item[1].map(data=>{
              formdata.append(item[0],data)
          return formdata
          })
          return come
      
      }
      else{

          formdata.append(item[0],item[1])
          return formdata
      }
  })
  }else{


    var SendDta = Object.entries(data).map((item)=>{


      if(item[0] == "NFTOrginalImage" ){


        for (const img of item[1]) {
          formdata.append('NFTOrginalImage', img)       
         }
      }
      else if(item[0] == "NFTThumpImage" ){


        for (const img of item[1]) {
          formdata.append('NFTThumpImage', img)       
         }
      }
      else{


        formdata.append(item[0],item[1])
         
      }

      return formdata
           
        
    })


}

return SendDta
}

// Common Axios Function
export const axiosFunc    =   async   (data)  =>  {
  try{
      let Resp    =   await axios(data)
      return Resp
  }
  catch(e){
      return {success:'error',msg:null}
  }
}
 