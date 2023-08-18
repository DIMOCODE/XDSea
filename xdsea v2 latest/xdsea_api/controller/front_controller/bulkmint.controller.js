import * as MongooseHelper from "../../helper/mongooseHelper";
import Tokens from "../../models/front_models/token.schema.js";
import TokenOwners from "../../models/front_models/tokenowner.schema.js";
import Bids from "../../models/front_models/bid.schema";
import userSchema from '../../models/front_models/user.schema'
import randomstring from "randomstring";

import {
    ImageAddFunc,
    compress_file_upload,
    ipfs_add,
    isEmpty,
    CollectionImageUpload,
    UploadToBucket,
    AddToIpfs
  } from "../../helper/commonFUnction";
import config from "../../config/serverConfig";
import fs from "fs";
import ActivitySchema from "../../models/front_models/activity.schema.js";
import CollectionSchema from "../../models/front_models/collection.schema.js";
import sharp from "sharp";
import collectionSchema from "../../models/front_models/collection.schema.js";
import { clearLine } from "readline";
// const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
// ffmpeg.setFfmpegPath(ffmpegPath);

const util = require('util');
var exec = util.promisify(require('child_process').exec)
const makeDir = util.promisify(fs.mkdir)

 

export const BulkMint = async(req,res)=>{



  try{
  const { NFTCreator,
     NFTName,
     NFTDescription ,
     fileType,
     Category,
     ClockTime,
     CoinName,
     CollectionName,
     CollectionNetwork,
     CollectionSymbol,
     ContractAddress,
     ContractType,
     EndClockTime,
     HashValue,
     NFTMinimumBid,
     NFTOrginalImagePreview,
     NFTThumpImagePreview,
     NFTOwner,
     NFTPrice,
    //  NFTProperties,
     NFTQuantity,
     NFTRoyalty,
     PutOnSale,
     PutOnSaleType,
     UnlockContent,
    
    
    } = req.body;
  var uploadFileType = fileType
  var UploadThumbFileType = "image"
  var originalFiles = req.files.NFTOrginalImage
  var Thumbfiles = req.files?.NFTThumpImage?req.files?.NFTThumpImage:false
  var respArr = []


  /// ---- > Storing Images

  if(uploadFileType == "image"){
    await Promise.all(

      await originalFiles.map(async (file,index) => {
        var name = String(NFTName.replace(/[^A-Z0-9]+/ig, "_"))+ "_" + randomstring.generate(3)+"_"+String(index)


      var NFTOrginalImage = await UploadToBucket({
    
        path:`nft/${NFTCreator}/Original/NFT/${name}.${ uploadFileType == "image" ? "webp":uploadFileType == "video"? "webm" : "mp3"}`,
        contenttoupload:file.data,
        contenttype:( uploadFileType == "image" ? "image/*":uploadFileType == "video"? "video/*" : "audio/*")
     
      })

      var compressedBuffer = await sharp(file.data, { animated: true }).webp({ quality: 80 }).toBuffer();

      var CompressedFile = await UploadToBucket({
          
        path:`nft/${NFTCreator}/Compressed/NFT/${name}.${ uploadFileType == "image" ? "webp":uploadFileType == "video"? "webm" : "mp3"}`,
        contenttoupload:compressedBuffer,
        contenttype:( uploadFileType == "image" ? "image/*":uploadFileType == "video"? "video/*" : "audio/*")
    
      })

      var NFTOrginalImageIpfs = await AddToIpfs(file.data);

      var NFTThumpImage = ""
      var NFTThumpImageIpfs = ""
      var CompressedThumbFile = "";

      var newmetadata = {
        name: name,
        image: NFTOrginalImageIpfs,
        description: NFTDescription,
      };

      var MetaData = await AddToIpfs(Buffer.from(JSON.stringify(newmetadata)))

      let JSOnpat = "public/nft/" + NFTCreator + "/jsonfolder";
      var MetFile = `${name.toLowerCase().replace(/\s/g, "")}.txt`;
      var senddata = JSON.stringify(newmetadata);


      AddMetaFile(JSOnpat,MetFile,senddata)

      if (MetaData) {
             
        respArr.push({
            NFTOrginalImage: NFTOrginalImage,
            NFTThumpImage: NFTThumpImage,
            CompressedFile: CompressedFile,
            CompressedThumbFile: CompressedThumbFile,
            NFTOrginalImageIpfs: NFTOrginalImageIpfs,
            NFTThumpImageIpfs: NFTThumpImageIpfs,
            MetaData: MetaData,
            MetFile: MetFile,
            NFTName:name,
            NFTDescription:NFTDescription ,
            fileType:fileType,
            Category:Category,
            ClockTime:ClockTime,
            CoinName:CoinName,
            CollectionName:CollectionName,
            CollectionNetwork:CollectionNetwork,
            CollectionSymbol:CollectionSymbol,
            ContractAddress:ContractAddress,
            ContractType:ContractType,
            EndClockTime:EndClockTime,
            HashValue:HashValue,
            NFTMinimumBid:NFTMinimumBid,
            NFTOrginalImagePreview:NFTOrginalImagePreview,
            NFTThumpImagePreview:NFTThumpImagePreview,
            NFTCreator:NFTCreator,
            NFTOwner:NFTOwner,
            NFTPrice:NFTPrice,
            // NFTProperties:NFTProperties,
            NFTQuantity:NFTQuantity,
            NFTRoyalty:NFTRoyalty,
            PutOnSale:PutOnSale,
            PutOnSaleType:PutOnSaleType,
            UnlockContent:UnlockContent,
            index:index,
            activity:"Mint"
          }
        );
      } 

      })

    )

    var orederedArr = []
    var ipfsArr = []

  

   for(let i=0;i<respArr.length;i++){
    var data = await respArr.find(item => item.index == i)
   
    orederedArr.push(data)
   }


    orederedArr.map((item)=>{
      ipfsArr.push(item.MetaData)
    })

    res.json({
      success: "success",
      msg: "Uploaded Successfully",
      data: orederedArr,
      ipfs:ipfsArr
    });
  }
  else{
    await Promise.all(

      await originalFiles.map(async (file,index) => {
        var name = String(NFTName.replace(/[^A-Z0-9]+/ig, "_")) + "_" + randomstring.generate(3)+"_"+String(index)

        var NFTOrginalImage = await UploadToBucket({
    
          path:`nft/${NFTCreator}/Original/NFT/${name}.${ uploadFileType == "image" ? "webp":uploadFileType == "video"? "webm" : "mp3"}`,
          contenttoupload:file.data,
          contenttype:( uploadFileType == "image" ? "image/*":uploadFileType == "video"? "video/*" : "audio/*")
       
        })

        var NFTOrginalImageIpfs = await AddToIpfs(file.data);
        var CompressedFile = ""

        
        var NFTThumpImage = await UploadToBucket({
  
          path:`nft/${NFTCreator}/Original/NFT_THUMB/${name}.${ UploadThumbFileType == "image" ? "webp":UploadThumbFileType == "video"? "webm" : "mp3"}`,
          contenttoupload:Thumbfiles[index].data,
          contenttype:( UploadThumbFileType == "image" ? "image/*":UploadThumbFileType == "video"? "video/*" : "audio/*")
       
        })

        var compressedThumbBuffer = await sharp(Thumbfiles[index].data, { animated: true }).webp({ quality: 80 }).toBuffer();


        var CompressedThumbFile = await UploadToBucket({
    
          path:`nft/${NFTCreator}/Compressed/NFT_THUMB/${name}.${ UploadThumbFileType == "image" ? "webp":UploadThumbFileType == "video"? "webm" : "mp3"}`,
          contenttoupload:compressedThumbBuffer,
          contenttype:( UploadThumbFileType == "image" ? "image/*":UploadThumbFileType == "video"? "video/*" : "audio/*")
      
        })

        var NFTThumpImageIpfs = await AddToIpfs(Thumbfiles[index].data)


        var newmetadata = {
          name: name,
          image: NFTThumpImageIpfs,
          description: NFTDescription,
          animation_url:NFTOrginalImageIpfs
        };

        var MetaData = await AddToIpfs(Buffer.from(JSON.stringify(newmetadata)))

        let JSOnpat = "public/nft/" + NFTCreator + "/jsonfolder";
        var MetFile = `${name.toLowerCase().replace(/\s/g, "")}.txt`;
        var senddata = JSON.stringify(newmetadata);
      
        AddMetaFile(JSOnpat,MetFile,senddata)

  
        if (MetaData) {
               
          respArr.push({
            NFTOrginalImage: NFTOrginalImage,
            NFTThumpImage: NFTThumpImage,
            CompressedFile: CompressedFile,
            CompressedThumbFile: CompressedThumbFile,
            NFTOrginalImageIpfs: NFTOrginalImageIpfs,
            NFTThumpImageIpfs: NFTThumpImageIpfs,
            MetaData: MetaData,
            MetFile: MetFile,
            NFTName:name,
            NFTDescription:NFTDescription ,
            fileType:fileType,
            Category:Category,
            ClockTime:ClockTime,
            CoinName:CoinName,
            CollectionName:CollectionName,
            CollectionNetwork:CollectionNetwork,
            CollectionSymbol:CollectionSymbol,
            ContractAddress:ContractAddress,
            ContractType:ContractType,
            EndClockTime:EndClockTime,
            HashValue:HashValue,
            NFTMinimumBid:NFTMinimumBid,
            NFTOrginalImagePreview:NFTOrginalImagePreview,
            NFTThumpImagePreview:NFTThumpImagePreview,
            NFTCreator:NFTCreator,
            NFTOwner:NFTOwner,
            NFTPrice:NFTPrice,
            // NFTProperties:NFTProperties,
            NFTQuantity:NFTQuantity,
            NFTRoyalty:NFTRoyalty,
            PutOnSale:PutOnSale,
            PutOnSaleType:PutOnSaleType,
            UnlockContent:UnlockContent,
            index:index,
            activity:"Mint"
       
          }
        );
        } 


      }),
 


    )

    
    var orederedArr = []
    var ipfsArr = []


    for(let i=0;i<respArr.length;i++){
      var data = await respArr.find(item => item.index == i)

      orederedArr.push(data)
     }

    orederedArr.map((item)=>{
      ipfsArr.push(item.MetaData)
    })
    res.json({
      success: "success",
      msg: "Uploaded Successfully",
      data: orederedArr,
      ipfs:ipfsArr
    });

  }


  }
  catch(err){
    return res.json({ success: "error", mgs: e.toString() });

  }

  



}


function AddMetaFile(JSOnpat,MetFile,senddata){

  fs.mkdir(JSOnpat, { recursive: true }, function (err, data) {
    if (err) return false;
    fs.writeFile(
      `${JSOnpat}/${MetFile}`,
      `${senddata}`,
      async function (err, data) {
        if (err) return err;
         
       
      }
    );
  });




}
