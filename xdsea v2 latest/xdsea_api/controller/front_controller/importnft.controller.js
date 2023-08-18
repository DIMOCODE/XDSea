import {ethers} from "ethers";
import SingleAbi from "../../abifolder/single.json";
import config from "../../config/serverConfig";
import Web3Utils from 'web3-utils';
import Web3 from "web3";
import Xdc3 from "xdc3";
import axios from "axios";
import * as MongooseHelper from "../../helper/mongooseHelper";
import CollectionSchema from "../../models/front_models/collection.schema.js";
import {
    ImageAddFunc,
    compress_file_upload,
    ipfs_add,
    isEmpty,
    CollectionImageUpload,
    UploadToBucket,
    AddToIpfs
  } from "../../helper/commonFUnction";

export const CreateCollectionValidation2 = async(req,res,next)=>{

  try{
  var xdc_instance = new Web3(config.rpcurl)

  
  

  var isExists = await CollectionSchema.find({contractAddress:req.body.contractAddress})
  
  if(isExists?.length > 0) return res.status(200).json({error:{contractAddress:"Contract Address already Exists"}})
  
  var isaddress = xdc_instance.utils.isAddress(req.body.contractAddress)
  if(!isaddress) return res.status(200).json({error:{contractAddress:"Enter Valid contract Address"}})
  

  try{
  var contract = new xdc_instance.eth.Contract(SingleAbi,req.body.contractAddress)
  
  var isowner = await contract.methods.owner().call()
  

  }
  catch(err){
    
    return res.status(200).json({error:{contractAddress:"Could not find contract owner"}})

  }
 
  
  try{
    var proxy_contract = new xdc_instance.eth.Contract(SingleAbi,isowner)
    var proxyowner = await proxy_contract.methods.owner().call()
    
 
     if(String(proxyowner).toLowerCase() !=  req.body.Creator) return res.status(200).json({error:{contractAddress:"Creator should be the collection address owner"}})
 


  }
  catch(err){
 
     if(String(isowner).toLowerCase() != req.body.Creator) return res.status(200).json({error:{contractAddress:"Creator should be the collection address owner"}})
 

  }

  var isNameExists = await MongooseHelper.FindOne({ DBName: CollectionSchema,
    FinData: {collectionName: req.body.collectionName},
    SelData: {}}) 

  var isUrlExists = await MongooseHelper.FindOne({  DBName: CollectionSchema,
      FinData: {customUrl: req.body.customUrl},
      SelData: {}})

      if(isNameExists.success == "success" || isUrlExists.success == "success"  ){
           
        var error = {};
        if(isNameExists.success == "success") error.name = "Collection Name Already Exists , Please enter a Different Name"
        if(isUrlExists.success == "success")  error.customurl = "Customurl Already Exists  , Please enter a Different Url"
        return res.status(200).json({error:error})
        

     }
    
     else {
      req.body.filter = "save"
       next();  
          }


  }
  catch(err){
    console.log("error in collection createtion",err)

  }

   
}

export const ImportCollection2 = async (req, res, next) => {
  
  const web3 = new Xdc3(config.rpcurl)

  try {

    var contractAddress = req.body.contractAddress;
   
    var defaultBlock = 49904437
   
    var latestBlock = await new web3.eth.getBlockNumber();
    var nftIdCreator = []
   
   

    async function getCollectionNfts(startblock) {

     

      if (startblock <= latestBlock  && nftIdCreator.length <= 500) {
        var startBlock = startblock
        var endBlock = (startBlock + 4999) > latestBlock ? latestBlock : startBlock + 4999

        

        var contract = new web3.eth.Contract(SingleAbi, contractAddress);
        var events = await contract.getPastEvents('Transfer', {
          filter: {
            _from: '0x0000000000000000000000000000000000000000'
          },
          fromBlock: startBlock,
          toBlock: endBlock,
        })

      

        if (events.length <= 0) {
          getCollectionNfts(endBlock + 1)
        } else {
          for (let i = 0; i < events.length; i++) {

            let nftObj = {
              tokenId: events[i].returnValues.tokenId,
              to: events[i].returnValues.to,
              from: events[i].returnValues.from,
              contractAddress: contractAddress,
              contractType: 721,
              nftBlock: startBlock
            }

            nftIdCreator.push(nftObj)

          }
          getCollectionNfts(endBlock + 1)
        }

      }
      else {
       
        var resp = await NFTUpdateDetails2(nftIdCreator.slice(0,500))
      
        if (resp) {
          req.body.importednfts = resp
          next()
        }
      }




    }

    getCollectionNfts(defaultBlock)

  }
  catch (err) {
   
    return res.status(200).json({ status: false, msg: "error in importing nfts" })

  }


}



export const NFTUpdateDetails2 = async (NftArr) => {
  var toStoreArr = [];
  if (NftArr.length == 0) return []

  const web3 = new Xdc3(config.rpcurl)
  var contract = new web3.eth.Contract(SingleAbi, NftArr[0].contractAddress)
  await Promise.all(

    NftArr.map(async (nft, index) => {
    
      try {
        var owner = await contract.methods.ownerOf(nft.tokenId).call()
        if (nft.from == "0x0000000000000000000000000000000000000000") {
          var obj = {
            NFTId: nft.tokenId,
            NFTCreator: String(nft.to).toLowerCase(),
            NFTOwner: String(owner).toLowerCase(),
            NFTName: "",
            NFTDescription: "",
            NFTImage: "",
            NFTAnimationUrl: "",
            contractAddress: nft.contractAddress,
            contractType: nft.contractType,
            fileType: "",
            CollectionNetwork: config.COIN_NAME,
            nftBlock: nft.nftBlock
          }

          toStoreArr.push(obj)

        }
      }
      catch (err) {
       
        console.log(">>>>>>>>>>>>> Burn called", err)

      }

    })
  )

  return toStoreArr;


}

export const EditCreateCollection = async(req,res,next)=>{
 
  if(req.files){
    if(req.files?.profile) {
      
      var toUploadFile =  req.files?.profile.data; 
      var profiename = `${req.body.collectionName}`+String(Date.now())+`.${req.files?.profile.mimetype.split("/")[1]}`
 
      
      var profile = {path:`collection/${req.body.collectionName}/profile/${profiename}`
                    ,contenttoupload:toUploadFile,
                     contenttype: "image/*"} //req.files?.profile.type

      var finurl = await UploadToBucket(profile)
      req.body.profileImage = finurl
     
    }
    if(req.files?.banner) {

      var toUploadFile =  req.files?.banner.data; 
      var bannername = `${req.body.collectionName}`+String(Date.now())+`.${req.files?.profile.mimetype.split("/")[1]}`

     
      var banner = {path:`collection/${req.body.collectionName}/banner/${bannername}`,
                    contenttoupload: toUploadFile,
                    contenttype: "image/*"}

      var finurl = await UploadToBucket(banner)
      req.body.BannerImage = finurl
    }
  }
  // new collection
 
  if(req?.body?.filter == "save"){
    var collection = new CollectionSchema(req.body)
    var savedcollection = await collection.save()
    if(savedcollection) {
      return res.status(200).json({status:true,msg:"Successfully Created !"})}
    else {
      return res.status(200).json({status:false,msg:"failed !"})}
  }
  else{
    // old collection image updation 
    var updData = (req.files.profile?{profileImage:req.body.profileImage}:{BannerImage:req.body.BannerImage})
    try{
    var UpdateCollection = await CollectionSchema.findOneAndUpdate({collectionName:req.body.collectionName},{$set: updData},{new:true})
    if(UpdateCollection){
       return res.status(200).json({status:true,msg:"Successfully Updated!"})}
    else return res.status(200).json({status:false,msg:"failed !"})

    }
    catch(err){
      console.log("data errr",err)
    }
  }

  
}

/// update imported colelctions nfts

const updatecollectionnfts = async()=>{
console.log("data called",config.TradeContract)

const web3 = new Xdc3(config.rpcurl)


 var toupdatecollections = await CollectionSchema.find({ $and: [ 
  { contractAddress: { $ne: config.TradeContract } }, 
  { contractAddress: { $ne: config.ERC721 } },
  { contractAddress: { $ne: config.ERC1155 } },
  { contractAddress: { $ne: ""} },
  { contractAddress: { $ne: null} }
   ] },{_id:0,contractAddress:1} )

   

  await Promise.all(

     toupdatecollections.map(async(address,index)=>{

      var defaultBlock = 60687643
      var latestBlock =  new web3.eth.getBlockNumber();
      var nftIdCreator = []
      var contractAddress = address.contractAddress

      async function getCollectionNfts(startblock) {

        if (startblock <= latestBlock) {
          var startBlock = startblock
          var endBlock = (startBlock + 4999) > latestBlock ? latestBlock : startBlock + 4999

  
          var contract = new web3.eth.Contract(SingleAbi, contractAddress);
          var events = await contract.getPastEvents('Transfer', {
  
            filter: {
                _from: '0x0000000000000000000000000000000000000000'
            },
            fromBlock: startBlock,
            toBlock: endBlock,
        })
  
        if (events.length <= 0) {
          getCollectionNfts(endBlock + 1)
  
  
          }else{
            for (let i = 0; i < events.length; i++) {
                           
                     
              let nftObj = { 
                tokenId:events[i].returnValues.tokenId,
                to: events[i].returnValues.to,
                from: events[i].returnValues.from,
                contractAddress:contractAddress ,
                contractType:721
               }
  
              
   
              nftIdCreator.push(nftObj)
          
      }
          getCollectionNfts( endBlock + 1)
          }
  
        } 
            else {
        
               var resp = await NFTUpdateDetails2(nftIdCreator)
               if(resp){
                   var updatecoll = await CollectionSchema.findOneAndUpdate({contractAddress:contractAddress},
                                                                            {$set:{importednfts:resp}},
                                                                            {new:true})
               }


            }
       

    }

    getCollectionNfts(defaultBlock)


     })
  )
}




export const CreateCollectionValidation3 = async(req,res,next)=>{

  try{
  var xdc_instance = new Web3(config.rpcurl)

  
  

  var isExists = await CollectionSchema.find({contractAddress:req.body.contractAddress})
  
  if(isExists?.length > 0) return res.status(200).json({error:{contractAddress:"Contract Address already Exists"}})
  var isaddress = xdc_instance.utils.isAddress(req.body.contractAddress)
  if(!isaddress) return res.status(200).json({error:{contractAddress:"Enter Valid contract Address"}})
  

  try{
  var contract = new xdc_instance.eth.Contract(SingleAbi,req.body.contractAddress)
  
  var isowner = await contract.methods.owner().call()
  

  }
  catch(err){
    return res.status(200).json({error:{contractAddress:"Enter Valid contract Address"}})
  }
 
  try{
    var proxy_contract = new xdc_instance.eth.Contract(SingleAbi,isowner)
    var proxyowner = await proxy_contract.methods.owner().call()



  }
  catch(err){
    console.log("the o/p address is wallet address")
    

  }

  var isNameExists = await MongooseHelper.FindOne({ DBName: CollectionSchema,
    FinData: {collectionName: req.body.collectionName},
    SelData: {}}) 

  var isUrlExists = await MongooseHelper.FindOne({  DBName: CollectionSchema,
      FinData: {customUrl: req.body.customUrl},
      SelData: {}})

      if(isNameExists.success == "success" || isUrlExists.success == "success"  ){
           
        var error = {};
        if(isNameExists.success == "success") error.name = "Collection Name Already Exists , Please enter a Different Name"
        if(isUrlExists.success == "success")  error.customurl = "Customurl Already Exists  , Please enter a Different Url"
        return res.status(200).json({error:error})
        

     }
    
     else {
     
      req.body.filter = "save"
       next();  
          }


  }
  catch(err){
    console.log("error in collection createtion",err)

  }

   
}

export const ImportCollection3 = async (req, res, next) => {
  const web3 = new Xdc3(config.rpcurl)
  

  try {

    var contractAddress = req.body.contractAddress;
    var defaultBlock = 49904437
    
    var latestBlock = await new web3.eth.getBlockNumber();
    var nftIdCreator = []

    async function getCollectionNfts(startblock) {

      if (startblock <= latestBlock  && nftIdCreator.length <= 500) {
        var startBlock = startblock
        var endBlock = (startBlock + 4999) > latestBlock ? latestBlock : startBlock + 4999

        var contract = new web3.eth.Contract(SingleAbi, contractAddress);
        var events = await contract.getPastEvents('Transfer', {
          filter: {
            _from: '0x0000000000000000000000000000000000000000'
          },
          fromBlock: startBlock,
          toBlock: endBlock,
        })

        if (events.length <= 0) {
          getCollectionNfts(endBlock + 1)
        } else {
          for (let i = 0; i < events.length; i++) {

            let nftObj = {
              tokenId: events[i].returnValues.tokenId,
              to: events[i].returnValues.to,
              from: events[i].returnValues.from,
              contractAddress: contractAddress,
              contractType: 721,
              nftBlock: startBlock
            }

            nftIdCreator.push(nftObj)

          }
  
          getCollectionNfts(endBlock + 1)
        }

      }
      else {
       
        var resp = await NFTUpdateDetails2(nftIdCreator.slice(0,500))
       
        if (resp) {
          req.body.importednfts = resp


        }
      }




    }

    getCollectionNfts(defaultBlock)

  }
  catch (err) {
    return res.status(200).json({ status: false, msg: "error in importing nfts" })

  }


}

