 

export const ImgValidation = (data,img) =>{
    let { type , size } = data
    if(img == 'thumb')
        {
            if(!type.includes('image')) return 'File Must be Image'
        }   
    else{
        if(img == 'pro') if(size >= 1024 * 1024 * 50) return 'File Must be Less than 50 Mb'
        else if(size >= 1024 * 1024 * 50) return 'File Must be Less than 50 Mb'

    }
}
 