 
import axios from 'axios'
import config from '../../config/config'
import {axiosFunc, AppenData} from '../common'

//NFT Name Validation Function
export const nftNameValidation   =   async   (data)  =>  {
    var senddata    =   {
        method  :   'post',
        url     :   `${config.BACK_URL}/nft/ValidateTokenName`,
        data    :   data
        }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}
//nftCreate axios
export const nftCreate    =   async   (data)  =>  {
    var formdata = AppenData(data)
    var senddata    =   {
        method  :   'post',
        url     :   `${config.BACK_URL}/nft/nftcreate`,
        data    :   formdata[0],
        'headers': {
            'Content-Type': 'multipart/form-data'
          }
    }
    
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

//Nft Image Upload Function
export const NFTImageUpload   =   async   (data)  =>  {
    var formdata = AppenData(data)
    var senddata    =   {
        method  :   'post',
        url     :   `${config.BACK_URL}/nft/nftimageupload`,
        data    :   formdata[0],
       
        'headers': {
            'Content-Type': 'multipart/form-data'
          }
        }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

// Create New NFT
export const CreateNFT    =   async   (data)  =>  {
    //  data.NFTProperties = !data.NFTProperties ? {property:"",value:""} : {property:"NFTProperties",value:data.NFTProperties}
    data.NFTProperties = !data.NFTProperties ? [] : data.NFTProperties

    var senddata    =   {
        method  :   'post',
        url     :   `${config.BACK_URL}/nft/createnft`,
        data    :   data,
        
        }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

// Get Category Function
export const Category    =   async   (data)  =>  {
    
    var senddata    =   {
        method  :   'GET',
        url     :   `${config.BACK_URL}/nft/getcategory`,
        }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

//GET All NFT
export const Token_List_Func    =   async   (data)  =>  {
    var senddata    =   {
        method  :   'GET',
        url     :   `${config.BACK_URL}/nft/Tokenlistfunc`,
        params  :   data
        }
    let Resp    =   await axiosFunc(senddata)

    return Resp.data
}
//get collection detaisl nft
export const Token_List_Func_collection    =   async   (data)  =>  {
        var senddata    =   {
            method  :   'GET',
            url     :   `${config.BACK_URL}/nft/collectionDetailPage`,
            params  :   data
            }
        let Resp    =   await axiosFunc(senddata)
    
        return Resp.data
    
 
}
//getstakedetails

export const getstakedetails    =   async   (data)  =>  {
    var senddata    =   {
        method  :   'GET',
        url     :   `${config.BACK_URL}/nft/getstakes`,
        params  :   data
        }
    let Resp    =   await axiosFunc(senddata)

    return Resp.data
}

//  get new nfts home page
export const newlycreatednfts    =   async   (data)  =>  {
    var senddata    =   {
        method  :   'GET',
        url     :   `${config.BACK_URL}/nft/newlycreatednfts`,
        
        }
    let Resp    =   await axiosFunc(senddata)

    return Resp.data
}

// get createdCollections
export const getCreatedCollections    =   async   (data)  =>  {
    var senddata    =   {
        method  :   'GET',
        url     :   `${config.BACK_URL}/nft/createdCollections`,
        params  :   data
        }
    let Resp    =   await axiosFunc(senddata)

    return Resp.data
}

//Get NFT info
export const Token_Info_Func    =   async   (data)  =>  {
    var senddata    =   {
        method  :   'GET',
        url     :   `${config.BACK_URL}/nft/info`,
        params  :   data
        }
    let Resp    =   await axiosFunc(senddata)
 

    return Resp.data
}
// UpdateWithdrawStatus

export const UpdateWithdrawStatus    =   async   (data)  =>  {
    var senddata    =   {
        method  :   'POST',
        url     :   `${config.BACK_URL}/nft/updatewithdrawstatus`,
        data  :   data
        }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}



//getpool

export const getpool    =   async   (data)  =>  {
    var senddata    =   {
        method  :   'GET',
        url     :   `${config.BACK_URL}/nft/getpoolinfopage`,
        params  :   data
        }
    let Resp    =   await axiosFunc(senddata)

    return Resp.data
}

//Buy And Accept 
export const BuyAccept =   async(data) =>  {
    var senddata    =   {
        method  :   'post',
        url     :   `${config.BACK_URL}/nft/BuyAccept`,
        data    :   data
        }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

//put on Sale
export const CreateOrder    =   async   (data)  =>  {
    var senddata    =   {
        method  :   'post',
        url     :   `${config.BACK_URL}/nft/CreateOrder`,
        data    :   data,
        
        }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

//Bid Function
export const BidApprove =   async(FormValue) =>  {
    var senddata    =   {
            method  :   'post',
            url     :   `${config.BACK_URL}/nft/BidAction`,
            data    :   FormValue
        }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

export const TopCreatorApi  =   async   ()  =>  {
    var senddata    =   {
        method  :   'get',
        url     :   `${config.BACK_URL}/nft/TopCreatorApi`
    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

export const getMyBids  =   async   (data)  =>  {
    var senddata    =   {
        method  :   'get',
        url     :   `${config.BACK_URL}/nft/getmybids`,
        params  :    data
    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

export const getReceivedBids  =   async   (data)  =>  {
    var senddata    =   {
        method  :   'get',
        url     :   `${config.BACK_URL}/nft/getreceivedbids`,
        params  :    data
    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

export const TopBuyerApi  =   async   ()  =>  {
    var senddata    =   {
        method  :   'get',
        url     :   `${config.BACK_URL}/nft/TopBuyerApi`
    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

export const HotAuctionHotSales =   async   ()  =>  {
    var senddata    =   {
        method  :   'get',
        url     :   `${config.BACK_URL}/nft/HotAuctionHotSale`
    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

export const getcollection =   async   (data)  =>  {
    var senddata    =   {
        method  :   'get',
        url     :   `${config.BACK_URL}/nft/getcollection`,
        params  :    data
    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

export const UpdateEligibilty_Db =   async   (data)  =>  {
    var senddata    =   {
        method  :   'post',
        url     :   `${config.BACK_URL}/nft/updateeligibility`,
        data  :    data
    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}
// updateBackValueDB

export const updateBackValueDB =   async   (data)  =>  {
    var senddata    =   {
        method  :   'post',
        url     :   `${config.BACK_URL}/nft/updateBackValueDB`,
        data  :    data
    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

export const CreateCollectionFunc = async(data) =>  {
    var formdata = AppenData(data)
    var senddata    =   {
        method  :   'post',
        url     :   `${config.BACK_URL}/nft/CreateCollectionFunc`,
        data    :   formdata[0],
        'headers': {
            'Content-Type': 'multipart/form-data'
          }
        }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}


export const CollectionByCreator =   async   (data)  =>  {
    var senddata    =   {
        method  :   'get',
        url     :   `${config.BACK_URL}/nft/CollectionByCreator`,
        params   :   data ?? {}
    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}
export const Activity_List_Func = async(data) => {
    var senddata    =   {
        method  :   'get',
        url     :   `${config.BACK_URL}/nft/Activity_List_Func`,
        params   :   data ?? {}
    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}
export const CollectionBySymbol = async(data) => {
    var senddata    =   {
        method  :   'get',
        url     :   `${config.BACK_URL}/nft/CollectionBySymbol`,
        params   :   data ?? {}
    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

// Search 

export const SearchAction    =   async   (data)  =>  {
    var senddata    = {
        method  :   'GET',
        url     :   `${config.BACK_URL}/nft/SearchAction`,
        params  :   data
        }
     let Resp    =   await axiosFunc(senddata)

 

    return Resp.data
}

export const SearchAction2    =   async   (data)  =>  {
 
    var senddata    = {
        method  :   'GET',
        url     :   `${config.BACK_URL}/nft/SearchActionTest`,
        params  :   data
        }
     let Resp    =   await axiosFunc(senddata)

 

    return Resp.data.data
}



//GetLikeStatus

export const GetLikeStatus    =   async   (data)  =>  {
    var senddata    = {
        method  :   'GET',
        url     :   `${config.BACK_URL}/nft/GetLikeStatus`,
        params  :   data
        }
     let Resp    =   await axiosFunc(senddata)
    return Resp.data
}


// Transfer

export const TransferNFT    =   async   (data)  =>  {
    var senddata    = {
        method  :   'POST',
        url     :   `${config.BACK_URL}/nft/BuyAccept`,
        data  :   data
        }
     let Resp    =   await axiosFunc(senddata)

    return Resp.data
}

export const BurnNFT    =   async   (data)  =>  {
    var senddata    = {
        method  :   'POST',
        url     :   `${config.BACK_URL}/nft/BurnUpdate`,
        data  :   data
        }
     let Resp    =   await axiosFunc(senddata)

    return Resp.data
}

export const Getpromotedtoken = async() =>{
    var senddata  =  {
        method  :   'get',
        url     :   `${config.BACK_URL}/nft/getpromotedtoken`,
    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

// Top collections in Landing Page

export const GetTopCollections= async(filter) =>{
    var senddata  =  {
        method  :   'get',
        url     :   `${config.BACK_URL}/nft/topcollections`,
        params  :   filter
    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}


 

export const createNewCollection= async(collectiondata) =>{
    var formdata = AppenData(collectiondata)

    var senddata  =  {
        method  :   'post',
        url     :   `${config.BACK_URL}/nft/createcolleciton`,
        data  :    formdata[0],
        'headers': {
            'Content-Type': 'multipart/form-data'
          }

    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

export const ImportNewCollection= async(collectiondata) =>{
    var formdata = AppenData(collectiondata)

    var senddata  =  {
        method  :   'post',
        url     :   `${config.BACK_URL}/nft/importcollections`,
        // url     :   `${config.BACK_URL}/nft/importcollectionstest`,
        data  :    formdata[0],
        'headers': {
            'Content-Type': 'multipart/form-data'
          }

    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

export const validateCollection= async(collectiondata) =>{
    var senddata  =  {
        method  :   'post',
        url     :   `${config.BACK_URL}/nft/collecitonvalidation`,
        data  :   collectiondata

    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}


export const GetPromotedcollection = async(data) =>{
    var senddata  =  {
        method  :   'get',
        url     :   `${config.BACK_URL}/nft/getpromotedcollection`,
        params   :   data
    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}
 

// List all NFts

export const ListNFts = async(data) =>{
    var senddata  =  {
        method  :   'post',
        url     :   `${config.BACK_URL}/nft/ListNFtFunc`,
        data    :    data
    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

// get CollectionDetails


export const CollectionDetail    =   async   (data)  =>  {
    var senddata    =   {
        method  :   'GET',
        url     :   `${config.BACK_URL}/nft/getcollectiondata`,
        params  :   data
        }
    let Resp    =   await axiosFunc(senddata)

    return Resp.data
}

 


/// Staking colleciton details


export const nftpooldetails    =   async   (data)  =>  {
    var senddata    =   {
        method  :   'GET',
        url     :   `${config.BACK_URL}/nft/nftpooldetails`,
        params  :   data
        }
    let Resp    =   await axiosFunc(senddata)

    return Resp.data
}

// stop stake 

export const stopstake    =   async   (data)  =>  {
    var senddata    =   {
        method  :   'POST',
        url     :   `${config.BACK_URL}/nft/stopstake`,
        data  :   data
        }
    let Resp    =   await axiosFunc(senddata)

    return Resp.data
}

//create stake

export const createstake    =   async   (data)  =>  {
    var senddata    =   {
        method  :   'POST',
        url     :   `${config.BACK_URL}/nft/createstake`,
        data  :   data
        }
    let Resp    =   await axiosFunc(senddata)

    return Resp.data
}

//withdrawstake

export const withdrawstake    =   async   (data)  =>  {
    var senddata    =   {
        method  :   'POST',
        url     :   `${config.BACK_URL}/nft/withdrawstake`,
        data  :   data
        }
    let Resp    =   await axiosFunc(senddata)

    return Resp.data
}
//
export const claimreward    =   async   (data)  =>  {
    var senddata    =   {
        method  :   'POST',
        url     :   `${config.BACK_URL}/nft/claimreward`,
        data  :   data
        }
    let Resp    =   await axiosFunc(senddata)

    return Resp.data
}

export const CollectionStatsData =   async   (data)  =>  {
    var senddata    =   {
        method  :   'get',
        url     :   `${config.BACK_URL}/nft/collectionsta`,
        params   :   data  
    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

export const BulkMintFunc   =   async   (data)  =>  {
    // data.NFTProperties = !data.NFTProperties ? {property:"",value:""} : {property:"NFTProperties",value:data.NFTProperties}
    var formdata = AppenData(data,true)

     
    var senddata    =   {
        method  :   'post',
        url     :   `${config.BACK_URL}/nft/bulkmintcall`,
        data    :   formdata[0],
       
        'headers': {
            'Content-Type': 'multipart/form-data'
          }
        }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

///check i ftoken exists for collection

export const checkIfTokenExists =   async   (data)  =>  {

    var senddata    =   {
        method  :   'post',
        url     :   `${config.BACK_URL}/nft/checknftintokens`,
        data   :   data  
    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

//ListImportedNfts

export const ListImportedNfts =   async   (data)  =>  {
    var senddata    =   {
        method  :   'post',
        url     :   `${config.BACK_URL}/nft/ListImportedNfts`,
        data   :   data  
    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

export const NftbalanceUpdate = async(data) =>{
    var senddata  =  {
        method  :   'POST',
        url     :   `${config.BACK_URL}/nft/findupdatebalance`,
        data    :   data
    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}
// addToCart

export const addToCart = async(data) =>{
    var senddata  =  {
        method  :   'POST',
        url     :   `${config.BACK_URL}/nft/addToCart`,
        data    :   data
    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

export const getcartlist  =   async   (data)  =>  {
    var senddata    =   {
        method  :   'get',
        url     :   `${config.BACK_URL}/nft/getCartItems`,
        params  :  data
    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}


export const updatecart = async(data) =>{
    var senddata  =  {
        method  :   'POST',
        url     :   `${config.BACK_URL}/nft/updatecart`,
        data    :   data
    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}

//buklkbuycall for db updation


export const bulkBuyCall = async(data) =>{
    var senddata  =  {
        method  :   'POST',
        url     :   `${config.BACK_URL}/nft/bulkbuyupdate`,
        data    :   data
    }
    let Resp    =   await axiosFunc(senddata)
    return Resp.data
}


export const PendingClaimedRewards    =   async   (data)  =>  {
    var senddata    =   {
        method  :   'GET',
        url     :   `${config.BACK_URL}/nft/PendingClaimedRewards`,
        params  :   JSON.stringify(data),
        
        }
    let Resp    =   await axiosFunc( senddata)

    return Resp.data
}

//Import collection load more function
export const importedCollectionLoadMore    =   async   (data)  =>  {
    var senddata    =   {
        method  :   'GET',
        url     :   `${config.BACK_URL}/nft/importedCollectionLoadMore`,
        params  :   data
        }
    let Resp    =   await axiosFunc(senddata)

    return Resp.data
}

 