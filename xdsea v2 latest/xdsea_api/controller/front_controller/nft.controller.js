import * as MongooseHelper from "../../helper/mongooseHelper";
import Tokens from "../../models/front_models/token.schema.js";
import TokenOwners from "../../models/front_models/tokenowner.schema.js";
import Bids from "../../models/front_models/bid.schema";
import userSchema from '../../models/front_models/user.schema'
import cartSchema from "../../models/front_models/cart.schema.js";
import SingleAbi from "../../abifolder/single.json";
import { BigNumber, ethers } from "ethers";
import web3 from "web3";
import Xdc3 from "xdc3"
import axios from "axios"

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
import StakingPool from "../../models/front_models/stakingpool.schema.js";

import { clearLine } from "readline";
import { Token } from "aws-sdk";
import Web3 from "web3";
import mongoose from "mongoose";
import { ImportCollection2, NFTUpdateDetails2 } from "./importnft.controller";
var ObjectId = mongoose.Types.ObjectId;
const ffmpeg = require("fluent-ffmpeg");




//NFT image and IPFS upload Function
export const nftImageUploadfs = async (req, res) => {
  try {
    const { NFTCreator, NFTName, NFTDescription } = req.body;
  
    var ref = Date.now();
    if (req?.files?.NFTOrginalImage) {
      var NFTOrginalImage = await ImageAddFunc([
        {
          path: `public/nft/${NFTCreator}/Original/NFT/`,
          files: req.files.NFTOrginalImage,
          filename:
            ref +
            "." +
            req.files.NFTOrginalImage.name.split(".")[
            req.files.NFTOrginalImage.name.split(".").length - 1
            ],
        },
      ]);
      var CompressedFile = await compress_file_upload([
        {
          path: `public/nft/${NFTCreator}/Compressed/NFT/`,
          files: req.files.NFTOrginalImage,
          filename:
            ref +
            (req.files.NFTOrginalImage.mimetype.includes("image")
              ? ".webp"
              : req.files.NFTOrginalImage.mimetype.includes("video")
                ? ".webm"
                : ".mp3"),
          fie_path:
            `public/nft/${NFTCreator}/Original/NFT/` +
            ref +
            "." +
            req.files.NFTOrginalImage.name.split(".")[
            req.files.NFTOrginalImage.name.split(".").length - 1
            ],
        },
      ]);

      var NFTOrginalImageIpfs = await ipfs_add({
        item: "img",
        path: `public/nft/${NFTCreator}/Original/NFT/${NFTOrginalImage}`,
      });

      if (req?.files?.NFTThumpImage) {
        var NFTThumpImage = await ImageAddFunc([
          {
            path: `public/nft/${NFTCreator}/Original/NFT_THUMB/`,
            files: req.files.NFTThumpImage,
            filename:
              ref +
              "." +
              req.files.NFTThumpImage.name.split(".")[
              req.files.NFTThumpImage.name.split(".").length - 1
              ],
          },
        ]);
        var CompressedThumbFile = await compress_file_upload([
          {
            path: `public/nft/${NFTCreator}/Compressed/NFT_THUMB/`,
            files: req.files.NFTThumpImage,
            filename: ref + ".webp",
          },
        ]);
        var NFTThumpImageIpfs = await ipfs_add({
          item: "img",
          path: `public/nft/${NFTCreator}/Original/NFT_THUMB/${NFTThumpImage}`,
        });
      } else
        var NFTThumpImage = "",
          NFTThumpImageIpfs = "",
          CompressedThumbFile = "";

      if (
        NFTOrginalImage &&
        NFTOrginalImageIpfs &&
        (NFTOrginalImage || NFTThumpImage) &&
        (NFTOrginalImageIpfs || NFTThumpImageIpfs)
      ) {
       
        var newmetadata = {
          name: NFTName,
          image: req.files.NFTOrginalImage.mimetype.includes("image")
            ? config.IPFS_IMG + NFTOrginalImageIpfs
            : config.IPFS_IMG + NFTThumpImageIpfs,
          description: NFTDescription,
        };
        if (NFTThumpImage) {
         
          newmetadata.animation_url = config.IPFS_IMG + NFTOrginalImageIpfs;

        }
       
        let JSOnpat = "public/nft/" + NFTCreator + "/jsonfolder";
        var MetFile = `${NFTName.toLowerCase().replace(/\s/g, "")}.txt`;

        fs.mkdir(JSOnpat, { recursive: true }, function (err, data) {
          if (err) return false;
          var senddata = JSON.stringify(newmetadata);
          fs.writeFile(
            `${JSOnpat}/${MetFile}`,
            `${senddata}`,
            async function (err, data) {
              if (err) return err;
              var MetaData = await ipfs_add({
                item: "img",
                path: `${JSOnpat}/${MetFile}`,
              });
              if (MetaData) {
                res.json({
                  success: "success",
                  msg: "Uploaded Successfully",
                  data: {
                    NFTOrginalImage: NFTOrginalImage,
                    NFTThumpImage: NFTThumpImage,
                    CompressedFile: CompressedFile,
                    CompressedThumbFile: CompressedThumbFile,
                    NFTOrginalImageIpfs: NFTOrginalImageIpfs,
                    NFTThumpImageIpfs: NFTThumpImageIpfs,
                    MetaData: MetaData,
                    MetFile: MetFile,
                  },
                });
              } else
                res.json({
                  success: "error",
                  msg: "Uploaded Failed",
                  data: {},
                });
            }
          );
        });
      }
    } else return res.json({ success: "error", mgs: "Nothing To Update" });
  } catch (e) {
    return res.json({ success: "error", mgs: e.toString() });
  }
};


 

  //New NFT Creation Function

export const createNewNFT = async (req, res) => {



  try {
    const {
      click,
      CollectionNetwork,
      CollectionName,
      NFTId,
      NFTName,
      Category,
      NFTDescription,
      NFTOrginalImage,
      NFTThumpImage,
      UnlockContent,
      CollectionSymbol,
      ContractAddress,
      ContractType,
      NFTRoyalty,
      NFTProperties,
      CompressedFile,
      CompressedThumbFile,
      NFTOrginalImageIpfs,
      NFTThumpImageIpfs,
      MetaData,
      MetFile,
      NFTCreator,
      NFTQuantity,
      PutOnSale,
      PutOnSaleType,
      NFTPrice,
      CoinName,
      ClockTime,
      EndClockTime,
      HashValue,
      NFTOwner,
      activity,
      NFTBalance,
      fileType
    } = req.body;
      var TokenADd = await TokenOwnerADD(
        {
          CollectionNetwork,
          CollectionName,
          MetFile,
          CollectionSymbol,
          NFTId,
          NFTName,
          Category,
          NFTDescription,
          NFTOrginalImage,
          NFTThumpImage,
          UnlockContent,
          ContractAddress,
          ContractType,
          NFTRoyalty,
          NFTProperties,
          CompressedFile,
          CompressedThumbFile,
          NFTOrginalImageIpfs,
          NFTThumpImageIpfs,
          MetaData,
          NFTCreator,
          NFTQuantity,
          activity,
          NFTOwner,
          fileType
        },
        {
          PutOnSale,
          PutOnSaleType,
          NFTPrice,
          CoinName,
          ClockTime,
          EndClockTime,
          HashValue,
          NFTOwner,
          NFTBalance,
        }
      );
  
    if(!req.body?.frominfo){
       await MongooseHelper.Activity({
 
        From:
          activity === "Mint"
            ? "NullAddress"
            : activity === "TransfersFiat"
              ? NFTCreator
              : NFTOwner,
        To: activity === "Mint" ? NFTCreator : NFTOwner,
        Activity: activity,
        NFTPrice: NFTPrice,
        Type: PutOnSale ? PutOnSaleType : "Not For Sale",
        CoinName: CoinName,
        NFTQuantity: NFTQuantity,
        HashValue: HashValue,
        NFTId: NFTId,
        ContractType: ContractType,
        ContractAddress: ContractAddress,
        CollectionNetwork: CollectionNetwork,
        Category: Category,
        CollectionSymbol: CollectionSymbol,
        CollectionName:CollectionName
      });
    }
  
    res.json(TokenADd);
  } catch (e) {
   
    return res.json({ success: "error", mgs: [], catch: e });
  }
};

export const TokenOwnerADD = async (data, tokenOWN) => {

    tokenOWN.NFTBalance = tokenOWN.NFTBalance
      ? tokenOWN.NFTBalance
      : tokenOWN.NFTQuantity
      ? tokenOWN.NFTQuantity
      : data.NFTQuantity;
    tokenOWN.NFTId = data.NFTId;
    tokenOWN.NFTOwner = tokenOWN.NFTOwner ? tokenOWN.NFTOwner : data.NFTCreator;
    tokenOWN.Status =
      tokenOWN.PutOnSale == true || tokenOWN.PutOnSale == "true"
        ? "list"
        : "not-list";
  
    let data_already_token = {
      DBName: TokenOwners,
      FinData: {
        NFTId: data.NFTId,
        NFTOwner: tokenOWN.NFTOwner ? tokenOWN.NFTOwner : data.NFTCreator,
        CollectionName:data.CollectionName ?data.CollectionName:tokenOWN.CollectionName
      },
      SelData: { _id: 0, NFTRoyalty: 1, NFTBalance: 1 },
    };
    let data_already_token_list = await MongooseHelper.FindOne(
      data_already_token
    );

    tokenOWN.NFTBalance =
      data.activity === "TransfersFiat"
        ? data_already_token_list?.msg?.NFTBalance
          ? Number(data_already_token_list?.msg?.NFTBalance) +
            Number(tokenOWN.NFTBalance)
          : tokenOWN.NFTBalance
        : tokenOWN.NFTBalance;

    if(tokenOWN.PutOnSaleType == "FixedPrice") tokenOWN.SaleStatus = "On Sale"
    if(tokenOWN.PutOnSaleType == "UnlimitedAuction") tokenOWN.SaleStatus = ""

    

        
    var finVal = {
      DBName: TokenOwners,
      FinData: {
        NFTId: data.NFTId,
        NFTOwner: tokenOWN.NFTOwner ? tokenOWN.NFTOwner : data.NFTCreator,
        CollectionName:data.CollectionName ?data.CollectionName:tokenOWN.CollectionName

      },
      Updata: { $set: tokenOWN },
      save: { new: true },
    };
    const Finddata = await MongooseHelper.FindOneAndUpdate(finVal);

    if (Finddata.data) {
      return Finddata;
    } else {

      tokenOWN.NFTQuantity = tokenOWN.NFTQuantity
        ? tokenOWN.NFTQuantity
        : data.NFTQuantity;
      tokenOWN.NFTBalance = tokenOWN.NFTBalance
        ? tokenOWN.NFTBalance
        : tokenOWN.NFTQuantity
        ? tokenOWN.NFTQuantity
        : data.NFTQuantity;

      tokenOWN.CollectionName =  tokenOWN.CollectionName?tokenOWN.CollectionName:data.CollectionName 
      tokenOWN.isStakeable = tokenOWN?.isStakeable ?tokenOWN?.isStakeable:false
      tokenOWN.PutOnSale = (!tokenOWN?.isStakeable)?tokenOWN.PutOnSale:(tokenOWN?.isStakeable == true) ? "true":"false"

      tokenOWN.backedValue = tokenOWN?.backedValue ?tokenOWN?.backedValue :1

      if(tokenOWN?.isStakeable ) tokenOWN.Status =  "list"

      // sale -- sold label
      if(tokenOWN?.PutOnSaleType == "FixedPrice" && tokenOWN.SaleStatus == "Sold") tokenOWN.SaleStatus =  "Sold"
      else if(tokenOWN?.PutOnSaleType == "FixedPrice" ) tokenOWN.SaleStatus =  "On Sale"


      var SenVal = { DBName: TokenOwners, Data: tokenOWN };
      let Resp = await MongooseHelper.Save(SenVal);
    
      if (Resp.success === "success") {
        var add = await TokenADD(data, Resp.data._id, "nor");
        return add;
      } else {
      
        return Resp;
      }
    }
  };


//Add NFT Owner (TokenOwners Table)
export const TokenADD = async (data, _id, val) => {
  
  data.NFTOwnerDetails = [_id];
  var newdata = {
    data,
  };

 
  let data_chk = {
    DBName: Tokens,
    // FinData: {NFTId: data.NFTId},
    FinData: {NFTId: data.NFTId,ContractAddress:data.ContractAddress},
    SelData: {},
  };
   
  var Find = await MongooseHelper.FindOne(data_chk);
 
  if (Find.success == "success") {
    return Find;
  } else {
    var SenVal = { DBName: Tokens, Data: newdata.data };
    let Resp = await MongooseHelper.Save(SenVal);

    try{
    var coll_update_data = {
      Creator:newdata.data.NFTCreator,
      collectionName:newdata.data.CollectionName
    }
   
    var updateCollectionCount = await collectionSchema.findOneAndUpdate(coll_update_data,{$inc:{collectionCount:1}},{new:true})
   
    }
    catch(err){
      console.log("err",err)
    }

    return Resp;
  }
};

// create collection  

export const CreateCollectionValidation = async (req, res, next) => {
  try {

    if(req.body.filter){
      return next()
    }

    var isNameExists = await MongooseHelper.FindOne({
      DBName: CollectionSchema,
      FinData: { collectionName: req.body.collectionName },
      SelData: {}
    })

    var isUrlExists = await MongooseHelper.FindOne({
      DBName: CollectionSchema,
      FinData: { customUrl: req.body.customUrl },
      SelData: {}
    })



    if (isNameExists.success == "success" || isUrlExists.success == "success") {

      var error = {};
      if (isNameExists.success == "success") error.name = "Collection Name Already Exists , Please enter a Different Name"
      if (isUrlExists.success == "success") error.customurl = "Customurl Already Exists  , Please enter a Different Url"

      return res.status(200).json({ status:false, error: error })


    }
   
    else {
      req.body.filter = req.body.filter ? req.body.filter : "save"
      next()
    }



  }
  catch (err) {
    console.log("error in collection createtion", err)
  }

}

// Create collection or Edit collection Image 
// create collection should contain a filter with value "save"

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
      var bannername = `${req.body.collectionName}`+String(Date.now())+`.${req.files?.banner.mimetype.split("/")[1]}`

     
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


 
 

export const EditCreateCollection_usingfs = async(req,res,next)=>{
   
  if(req.files){
    if(req.files?.profile) {
      var profiename = `${req.body.collectionName}`+String(Date.now())+".webp"
      req.body.profileImage = `public/collection/${req.body.collectionName}/profile/${profiename}`
      var profile = {path:`public/collection/${req.body.collectionName}/profile`,file:req.files.profile,filename: profiename}
      await CollectionImageUpload(profile)
    }
    if(req.files?.banner) {
      var bannername = `${req.body.collectionName}`+String(Date.now())+".webp"
      req.body.BannerImage = `public/collection/${req.body.collectionName}/profile/${bannername}`
      var banner = {path:`public/collection/${req.body.collectionName}/banner`,file:req.files.banner,filename:bannername}
      await CollectionImageUpload(banner)
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
    var UpdateCollection = await CollectionSchema.findOneAndUpdate({collectionName:req.body.collectionName},{$set:req.body},{new:true})
    if(UpdateCollection){
       return res.status(200).json({status:true,msg:"Successfully Updated!"})}
    else return res.status(200).json({status:false,msg:"failed !"})
  }

  
}

// Get collection Stats along with profile , banner images

export const GetCollectionStats = async (req, res) => {
  try {

    if (req.body.collectionName) {
      var data = await CollectionSchema.aggregate([
        { $match: { collectionName: "CRYPTO PAPA COLLECTION" } },
        {
          $lookup: {
            from: "tokenowners",
            let: { "collectionName": "$collectionName" },
            pipeline: [
              { $match: { $expr: { $and: [{ $eq: ["$CollectionName", "$$collectionName"] }, { $gt: ["$NFTBalance", 0] }] } } }
            ], as: "nfts"
          }
        },
        { $unwind: "$nfts" },
        {
          $group: {
            _id: "$collectionName",
            volume: { $first: "$volume" },
            floorPrice: { $first: "$floorPrice" },
            collectionName: { $first: "$collectionName" },
            collectionCount: { $first: "$collectionCount" },
            ownesCount: { $sum: 1 },
            profile: { $first: "$profileImage" },
            banner: { $first: "$BannerImage" },
          }
        }

      ])
      res.status(200).json({ status: true, data: data })
    }

  }
  catch (err) {
    res.status(200).json({ status: false, data: [], msg: "failed" })
  }

}


// get collection nfts

export const GetCollectionNfts = async (req, res) => {


  const {

    limit,
    CollectionName,
    page,
    from,
    Sort,
    Filter,
    cursor,
  } = req.query;

  try {

    var SendDta = {};
    SendDta.limit = parseInt(limit) ?? 1;
    SendDta.skip = ((page ? parseInt(page) : 1) - 1) * limit;
    SendDta.from = from;

    if (from == "gallerycollection") {

      SendDta.fromMatch = {
        $expr: {
          $and: [
            { $ne: ["$NFTBalance", "0"] },
            { $eq: ["$HideShow", "visible"] },
            { $eq: ["$CollectionName", CollectionName] },
          ],
        },
      };

      SendDta.refMatch = {
        $expr: {
          $and: [{ $eq: ["$NFTId", "$$tId"] },
          { $eq: ["$isHidden", false] }

          ],

        },
      };

      SendDta.sort = { timestamp: -1 };
      SendDta.refTable = "tokens";
      SendDta.fromTable = TokenOwners;
      var data = await MongooseHelper.MyItemList(SendDta);
  
      res.send(data)


    }
  } catch (err) {
    console.log(err, err)
  }






};


//MYITEM Page List of NFTs
export const MyItemTokenlistfunc = async (req, res) => {
  const {
    TabName,
    limit,
    CustomUrl,
    WalletAddress,
    NFTOwner,
    page,
    from,
    Sort,
    Filter,
    cursor,
    NFTId
  } = req.query;
  var SendDta = {};
  SendDta.limit = parseInt(limit) ?? 1;
  SendDta.skip = ((page ? parseInt(page) : 1) - 1) * limit;
  SendDta.from = from;


  var Follow = {};
  if (from == "myItem") {
    if (TabName == "owned") {
      SendDta.fromMatch = {
        $expr: {
          $and: [
            { $ne: ["$NFTBalance", "0"] },
            { $eq: ["$HideShow", "visible"] },
            { $eq: ["$NFTOwner", NFTOwner] },
          ],
        },
      };
      SendDta.refMatch = {
        $expr: {
    
          $and: [{ $eq: ["$NFTId", "$$tId"] },
 
                 { $eq: ["$CollectionName", "$$collname"] },
                  { $eq: ["$isHidden", false] } 
              
        ],
 

        },
      };
      SendDta.sort = { timestamp: -1 };
      SendDta.refTable = "tokens";
      SendDta.fromTable = TokenOwners;
    }
    if (TabName == "onsale") {
      SendDta.fromMatch = {
        $expr: {
          $and: [
            { $ne: ["$NFTBalance", "0"] },
            { $eq: ["$HideShow", "visible"] },
            { $eq: ["$PutOnSale", "true"] },
            { $eq: ["$PutOnSaleType", "FixedPrice"] },
            { $eq: ["$NFTOwner", NFTOwner] },
          ],
        },
      };
      SendDta.refMatch = {
        $expr: {
          $and: [{ $eq: ["$NFTId", "$$tId"] },
          { $eq: ["$isHidden", false] }
          ],

        },
      };
      SendDta.sort = { timestamp: -1 };
      SendDta.refTable = "tokens";
      SendDta.fromTable = TokenOwners;
    }
    if (TabName == "created") {
      SendDta.fromMatch = {
        $expr: {
          $and: [
            { $ne: ["$NFTBalance", "0"] },
            { $eq: ["$HideShow", "visible"] },
            {
              $eq: [
                "$NFTCreator",
                NFTOwner
              ]
            }
          ],
        },
      };
      SendDta.refMatch = {
        $expr: {
          $and: [{ $eq: ["$NFTId", "$$tId"] },
          { $eq: ["$isHidden", false] },
          { $eq: ["$CollectionName", "$$collname"] },

          { $eq: ["$NFTCreator", NFTOwner] }
          ],

        },
      };
      SendDta.sort = { timestamp: -1 };
      SendDta.refTable = "tokens";
      SendDta.fromTable = Tokens;
    }

    if (TabName == 'liked') {
      var data = {};
      data.DBName = LikeDb;
      data.FinData = { "WalletAddress": NFTOwner }

      data.SelData = { 'NFTId': 1, _id: 0 };
      var resp = await MongooseHelper.Find(data)
      var Id = [];
      Id = resp.msg.map((val) => val.NFTId)
      if (resp.msg && resp.msg.length > 0) {
        SendDta.fromMatch = {
          $expr: {
            '$and': [
              { '$ne': ['$NFTBalance', '0'] },
              { '$eq': ['$HideShow', 'visible'] },
              { '$in': ['$NFTId', Id] }
            ]
          }
        }

        SendDta.refMatch = {
          $expr: {
            '$and': [
              { $eq: ['$NFTId', '$$tId'] },
              { $ne: ['$HideShow', "Hidden"] }
            ]
          }
        }
        SendDta.sort = { 'updatedAt': -1 }
        SendDta.refTable = 'tokens'
        SendDta.fromTable = TokenOwners
      }

    }

    if (TabName == "following") {
      Follow.Follow_Initial_Match = { "WalletAddress": { $eq: NFTOwner } }
      Follow.unwind = "$Following";
      Follow.from = "follow";
      Follow.usermatchAdd = "$Following.Address";
      Follow.usermatchPro = "$Following.CustomUrl";

      Follow.fromTable = userSchema;
    }
    if (TabName == "follower") {
      Follow.Follow_Initial_Match = { "WalletAddress": { $eq: NFTOwner } }
      Follow.unwind = "$Follower";
      Follow.from = "follower";
      Follow.usermatchAdd = "$Follower.Address";
      Follow.usermatchPro = "$Follower.CustomUrl";
      Follow.fromTable = userSchema;
    }
    if (TabName == "usercollection") {
      SendDta.UserCollection = {
        chain: EvmChain.BSC,
        address: NFTOwner.toString().toLowerCase(),
        limit: Number(limit),
        cursor: cursor,
      };
    }
    if (TabName == "activity") {
 
      SendDta.sort = { updatedAt: -1 };
      SendDta.Tokens = ActivitySchema;
      // SendDta.TabName = TabName
      var filter = req.query.filter
      if (filter && filter == "All") {
        // SendDta.TokenMatch = {};
 
        SendDta.TokenMatch = {"NFTId":NFTId,ContractAddress:req.query.ContractAddress}
 

      }
      else if (filter && filter == "myActivity") {
        SendDta.TokenMatch = {
          $expr: {
            $or: [{ $eq: ["$From", NFTOwner] }, { $eq: ["$To", NFTOwner] }],
          },
        };
      }
      else if (filter && filter == "Mint") {
        SendDta.TokenMatch = { "Activity": "Mint" }
      }
      else if (filter && filter == "Bid") {
        SendDta.TokenMatch = { "Activity": "Bid" }
      }
      else if (filter && filter == "Accept") {
        SendDta.TokenMatch = { "Activity": "Accept" }
      }
      else if (filter && filter == "Buy") {
        SendDta.TokenMatch = { "Activity": "Buy" }
      }
      else if (filter && filter == "PutOnSale") {
        SendDta.TokenMatch = { "Activity": "PutOnSale" }
      }
      else if (filter && filter == "CancelOrder") {
        SendDta.TokenMatch = { "Activity": "CancelOrder" }
      }

    }
    if (TabName == "collection") {
      Follow.Follow_Initial_Match = {
        $expr: { $eq: ["$CollectionCreator", NFTOwner] },
      };
      Follow.unwind = "$Following";
      Follow.from = "collection";
      Follow.fromTable = Collection;
    }
  }


  var RetData =
    TabName == "following" || TabName == "follower"
      ? await MongooseHelper.FollowUnFollowList(Follow, SendDta)
      : TabName == "activity"
        ? await MongooseHelper.ActivityList(SendDta)
        : TabName == "usercollection"
          ? await MongooseHelper.UserCollection(SendDta.UserCollection)
          : TabName == "collection"
            ? await MongooseHelper.CollectionList(Follow, SendDta)
            : await MongooseHelper.MyItemList(SendDta);

  res.json(RetData);
};


export const nftImageUpload = async (req, res) => {
  try {
    const { NFTCreator, NFTName, NFTDescription } = req.body;

    var ref = Date.now();
    var uploadFileType = req.files.NFTOrginalImage.mimetype.split("/")[0]

    if (req?.files?.NFTOrginalImage) {

      var NFTOrginalImage = await UploadToBucket({

        path: `nft/${NFTCreator}/Original/NFT/${ref}.${uploadFileType == "image" ? "webp" : uploadFileType == "video" ? "webm" : "mp3"}`,
        contenttoupload: req.files.NFTOrginalImage.data,
        contenttype: (uploadFileType == "image" ? "image/*" : uploadFileType == "video" ? "video/*" : "audio/*")

      })
  


      // ---->  compressed file 

      if (uploadFileType == "image") {

        var compressedBuffer = await sharp(req.files.NFTOrginalImage.data, { animated: true }).webp({ quality: 80 }).toBuffer();
  

        var CompressedFile = await UploadToBucket({

          path: `nft/${NFTCreator}/Compressed/NFT/${ref}.${uploadFileType == "image" ? "webp" : uploadFileType == "video" ? "webm" : "mp3"}`,
          contenttoupload: compressedBuffer,
          contenttype: (uploadFileType == "image" ? "image/*" : uploadFileType == "video" ? "video/*" : "audio/*")

        })
  

      }

      /// -----> ipfs 

      var NFTOrginalImageIpfs = await AddToIpfs(req.files.NFTOrginalImage.data);


      /// ----> Thumbnail area

      if (req?.files?.NFTThumpImage) {

        var UploadThumbFileType = (req?.files?.NFTThumpImage.mimetype).includes("image") ? "image" :
          (req?.files?.NFTThumpImage.mimetype).includes("video") ? "video" : "audio"

        /// -----> original thumb image

        var NFTThumpImage = await UploadToBucket({

          path: `nft/${NFTCreator}/Original/NFT_THUMB/${ref}.${UploadThumbFileType == "image" ? "webp" : UploadThumbFileType == "video" ? "webm" : "mp3"}`,
          contenttoupload: req.files.NFTThumpImage.data,
          contenttype: (UploadThumbFileType == "image" ? "image/*" : UploadThumbFileType == "video" ? "video/*" : "audio/*")

        })
       


        // // ---->  compressed Thumb file 

        if (UploadThumbFileType == "image") {

          var compressedThumbBuffer = await sharp(req.files.NFTThumpImage.data, { animated: true }).webp({ quality: 80 }).toBuffer();
         

          var CompressedThumbFile = await UploadToBucket({

            path: `nft/${NFTCreator}/Compressed/NFT_THUMB/${ref}.${UploadThumbFileType == "image" ? "webp" : UploadThumbFileType == "video" ? "webm" : "mp3"}`,
            contenttoupload: compressedThumbBuffer,
            contenttype: (UploadThumbFileType == "image" ? "image/*" : UploadThumbFileType == "video" ? "video/*" : "audio/*")

          })
        

        }


        var NFTThumpImageIpfs = await AddToIpfs(req.files.NFTThumpImage.data)


      

      } else
        var NFTThumpImage = "",
          NFTThumpImageIpfs = "",
          CompressedThumbFile = "";


      //// ----> metadata    

      if (
        NFTOrginalImage &&
        NFTOrginalImageIpfs &&
        (NFTOrginalImage || NFTThumpImage) &&
        (NFTOrginalImageIpfs || NFTThumpImageIpfs)
      ) {

        var newmetadata = {
          name: NFTName,
          image: req.files.NFTOrginalImage.mimetype.includes("image")
            ? NFTOrginalImageIpfs
            : NFTThumpImageIpfs,
          description: NFTDescription,
        };
        if (NFTThumpImage) {
          // newmetadata.animation_url = config.IPFS_IMG + NFTThumpImageIpfs;
          newmetadata.animation_url = NFTOrginalImageIpfs;

        }
      

        let JSOnpat = "public/nft/" + NFTCreator + "/jsonfolder";
        var MetFile = `${NFTName.toLowerCase().replace(/\s/g, "")}.txt`;

        fs.mkdir(JSOnpat, { recursive: true }, function (err, data) {
          if (err) return false;
          var senddata = JSON.stringify(newmetadata);
          fs.writeFile(
            `${JSOnpat}/${MetFile}`,
            `${senddata}`,
            async function (err, data) {
              if (err) return err;
              var MetaData = await AddToIpfs(Buffer.from(JSON.stringify(newmetadata)))

              if (MetaData) {
                res.json({
                  success: "success",
                  msg: "Uploaded Successfully",
                  data: {
                    NFTOrginalImage: NFTOrginalImage,
                    NFTThumpImage: NFTThumpImage,
                    CompressedFile: CompressedFile,
                    CompressedThumbFile: CompressedThumbFile,
                    NFTOrginalImageIpfs: NFTOrginalImageIpfs,
                    NFTThumpImageIpfs: NFTThumpImageIpfs,
                    MetaData: MetaData,
                    MetFile: MetFile,
                  },
                });
              } else
                res.json({
                  success: "error",
                  msg: "Uploaded Failed",
                  data: {},
                });
            }
          );
        });

      }
    } else return res.json({ success: "error", mgs: "Nothing To Update" });

  } catch (e) {
    return res.json({ success: "error", mgs: e.toString() });
  }
};


export const bulkupload = async (req, res) => {
  try {
    const { NFTCreator, NFTName, NFTDescription } = req.body;
    

    var ref = String(Date.now());
    var uploadFileType = req.files.NFTOrginalImage.mimetype.split("/")[0]
    var temp = 0;


    // considering req?.files?.NFTOrginalImage to be a array of objects
    if (req?.files?.NFTOrginalImage) {

      var finalresult = await promises.all(
        (req?.files?.NFTOrginalImage).map(async (item) => {
          const { data, name, mimetype } = item;

          var NFTOrginalImage = await UploadToBucket({

            path: `nft/${NFTCreator}/Original/NFT/${ref + String(temp)}.${uploadFileType == "image" ? "webp" : uploadFileType == "video" ? "webm" : "mp3"}`,
            contenttoupload: req.files.NFTOrginalImage.data,
            contenttype: (uploadFileType == "image" ? "image/*" : uploadFileType == "video" ? "video/*" : "audio/*")

          })
        })
      )

      // ---- //   original imgae

      var NFTOrginalImage = await UploadToBucket({

        path: `nft/${NFTCreator}/Original/NFT/${ref + String(temp)}.${uploadFileType == "image" ? "webp" : uploadFileType == "video" ? "webm" : "mp3"}`,
        contenttoupload: req.files.NFTOrginalImage.data,
        contenttype: (uploadFileType == "image" ? "image/*" : uploadFileType == "video" ? "video/*" : "audio/*")

      })
  


      // ---->  compressed file 

      if (uploadFileType == "image") {

        var compressedBuffer = await sharp(req.files.NFTOrginalImage.data, { animated: true }).webp({ quality: 80 }).toBuffer();
       

        var CompressedFile = await UploadToBucket({

          path: `nft/${NFTCreator}/Compressed/NFT/${ref}.${uploadFileType == "image" ? "webp" : uploadFileType == "video" ? "webm" : "mp3"}`,
          contenttoupload: compressedBuffer,
          contenttype: (uploadFileType == "image" ? "image/*" : uploadFileType == "video" ? "video/*" : "audio/*")

        })
       

      }

      /// -----> ipfs 

      var NFTOrginalImageIpfs = await AddToIpfs(req.files.NFTOrginalImage.data);


      /// ----> Thumbnail area

      if (req?.files?.NFTThumpImage) {

        var UploadThumbFileType = (req?.files?.NFTThumpImage.mimetype).includes("image") ? "image" :
          (req?.files?.NFTThumpImage.mimetype).includes("video") ? "video" : "audio"


        /// -----> original thumb image

        var NFTThumpImage = await UploadToBucket({

          path: `nft/${NFTCreator}/Original/NFT_THUMB/${ref}.${UploadThumbFileType == "image" ? "webp" : UploadThumbFileType == "video" ? "webm" : "mp3"}`,
          contenttoupload: req.files.NFTThumpImage.data,
          contenttype: (UploadThumbFileType == "image" ? "image/*" : UploadThumbFileType == "video" ? "video/*" : "audio/*")

        })
      


        // // ---->  compressed Thumb file 

        if (UploadThumbFileType == "image") {

          var compressedThumbBuffer = await sharp(req.files.NFTThumpImage.data, { animated: true }).webp({ quality: 80 }).toBuffer();
         

          var CompressedThumbFile = await UploadToBucket({

            path: `nft/${NFTCreator}/Compressed/NFT_THUMB/${ref}.${UploadThumbFileType == "image" ? "webp" : UploadThumbFileType == "video" ? "webm" : "mp3"}`,
            contenttoupload: compressedThumbBuffer,
            contenttype: (UploadThumbFileType == "image" ? "image/*" : UploadThumbFileType == "video" ? "video/*" : "audio/*")

          })
        

        }


        var NFTThumpImageIpfs = await AddToIpfs(req.files.NFTThumpImage.data)


       

      } else
        var NFTThumpImage = "",
          NFTThumpImageIpfs = "",
          CompressedThumbFile = "";


      //// ----> metadata    

      if (
        NFTOrginalImage &&
        NFTOrginalImageIpfs &&
        (NFTOrginalImage || NFTThumpImage) &&
        (NFTOrginalImageIpfs || NFTThumpImageIpfs)
      ) {

        var newmetadata = {
          name: NFTName,
          image: req.files.NFTOrginalImage.mimetype.includes("image")
            ? NFTOrginalImageIpfs
            : NFTThumpImageIpfs,
          description: NFTDescription,
        };
        if (NFTThumpImage) {
          // newmetadata.animation_url = config.IPFS_IMG + NFTThumpImageIpfs;
          newmetadata.animation_url = NFTOrginalImageIpfs;

        }
      

        let JSOnpat = "public/nft/" + NFTCreator + "/jsonfolder";
        var MetFile = `${NFTName.toLowerCase().replace(/\s/g, "")}.txt`;

        fs.mkdir(JSOnpat, { recursive: true }, function (err, data) {
          if (err) return false;
          var senddata = JSON.stringify(newmetadata);
          fs.writeFile(
            `${JSOnpat}/${MetFile}`,
            `${senddata}`,
            async function (err, data) {
              if (err) return err;
              var MetaData = await AddToIpfs(Buffer.from(JSON.stringify(newmetadata)))

              if (MetaData) {
              
                res.json({
                  success: "success",
                  msg: "Uploaded Successfully",
                  data: {
                    NFTOrginalImage: NFTOrginalImage,
                    NFTThumpImage: NFTThumpImage,
                    CompressedFile: CompressedFile,
                    CompressedThumbFile: CompressedThumbFile,
                    NFTOrginalImageIpfs: NFTOrginalImageIpfs,
                    NFTThumpImageIpfs: NFTThumpImageIpfs,
                    MetaData: MetaData,
                    MetFile: MetFile,
                  },
                });
              } else
                res.json({
                  success: "error",
                  msg: "Uploaded Failed",
                  data: {},
                });
            }
          );
        });

      }
    } else return res.json({ success: "error", mgs: "Nothing To Update" });

  } catch (e) {
   
    return res.json({ success: "error", mgs: e.toString() });
  }
};


// get all collecitons to list in create page

export const CollectionByCreator = async (req, res) => {

  try {
    var data = await CollectionSchema.find({ Creator: req.query.Creator, collectionType: req.query.Type }, { collectionName: 1, customUrl: 1 })
    var options = []

    if (data && data.length > 0) {

      data.map((item) => {
       
        var temp = {
          collectionName: item.collectionName,
          customUrl: item.customUrl,
          label: item.collectionName
        }
        options.push(temp)

      })

    }

    options.push({
      collectionName: "",
      customUrl: "",
      label: "Create Collection"
    })
   
    res.status(200).json({ status: true, data: options })

  } catch (err) {
   
    res.status(200).json({ status: false, data: [] })
  }

};


// TopCollections

export const TopCollections = async (req, res) => {
 
  try {
    if (req.query.filter == "topcollections") {
      var data = await CollectionSchema.find({ collectionCount: { $ne: 0 } }).sort({ volume: -1 }).limit(10)
      var xd_monkey = await CollectionSchema.find({ collectionName: "XDSEA MONKEYS ORIGINAL ART" })
      data[0] = xd_monkey[0]

      return res.status(200).json({ status: true, data: data })
    }
    else if (req.query.filter == "collectionlist") {
      // var limitvalue = 15 
      // var skipvalue = (req.query.page == 1)? 0: 15 * req.query.page
      var limitvalue = 15 
      var skipvalue = req.query.skip


      if (req.query.sortfilter == "Recent") var data = await CollectionSchema.find().sort({ _id: -1 }).skip(skipvalue).limit(limitvalue)
      else if (req.query.sortfilter == "old") var data = await CollectionSchema.find().skip(skipvalue).limit(limitvalue)
      else if (req.query.sortfilter == "Staking") var data = await CollectionSchema.find({ isStakeable: true }).skip(skipvalue).limit(limitvalue)
      else if (req.query.sortfilter == "volume") var data = await CollectionSchema.find().sort({ volume: -1 }).skip(skipvalue).limit(limitvalue)


      return res.status(200).json({ status: true, data: data })
    }
    else if (req.query.filter == "mycollections") {
    
      var limitvalue = 15 * req.query.page
      var skipvalue = req.query.skip

      if (req.query.sortfilter == "Recent") var data = await CollectionSchema.find({ Creator: req.query.Creator }).sort({ _id: -1 }).skip(skipvalue).limit(limitvalue)
      else if (req.query.sortfilter == "old") var data = await CollectionSchema.find({ Creator: req.query.Creator }).skip(skipvalue).limit(limitvalue)
      else if (req.query.sortfilter == "Staking") var data = await CollectionSchema.find({ isStakeable: true, Creator: req.query.Creator }).skip(skipvalue).limit(limitvalue)
      else if (req.query.sortfilter == "volume") var data = await CollectionSchema.find({ Creator: req.query.Creator }).sort({ volume: -1 }).skip(skipvalue).limit(limitvalue)

      return res.status(200).json({ status: true, data: data })
    }

    // home page latest collections
    var data = await CollectionSchema.find().sort({ _id: -1 }).limit(8)
    return res.status(200).json({ status: true, data: data })

  } catch (err) {
    res.status(200).json({ status: false, data: [] })
  }

};

export const validateNFTName = async (req, res) => {
  let data = {
    DBName: Tokens,
    FinData: { NFTName: req.body.NFTName },
    SelData: { _id: 0, NFTName: 1 },
  };
  let List = await MongooseHelper.FindOne(data);
  if (List.success == "success")
    res.json({ success: "error", msg: "TokenName Already exits" });
  else res.json({ success: "success", msg: null });
};



// xdsea


//Get Token List
export const Tokenlistfunc = async (req, res) => {
  const { TabName, limit, CustomUrl, page, from, CollectionSymbol ,Filter , isCategory, isGetStake,isStakepage, skip } = req.query;
  var SendDta = {};
  SendDta.limit = limit ? parseInt(limit) : Number.MAX_SAFE_INTEGER;
  // SendDta.skip = (((page ? parseInt(page) : 1) - 1) * (limit ?? 0)) ?? 0;
  SendDta.skip =  skip ? parseInt(skip) : 0;

  SendDta.CustomUrl = CustomUrl;
  SendDta.from = from;
  if (from == "Explore" && isCategory && isCategory == "notcategory" ) {

    SendDta.tokenOwnerMatch = {
      $expr: {
        $and: [
          { $ne: ["$NFTBalance", "0"] },
          { $eq:["$Status", 'list' ]},
          { $eq: ["$HideShow", "visible"] },
        ],
      },
    };

    SendDta.TokenMatch =  {
 
          "$expr": {
               $and: [
{ $eq: ["$NFTId", "$$nftid"] },
{ $eq: ["$CollectionName", "$$collname"] },
{ $eq: ["$HideShow", "visible"] },
],
            
          
      }
  }

   


    if (TabName == "PriceLowToHigh") {
      SendDta.sort = { "NFTPrice": 1 };
      SendDta.tokenOwnerMatch['$expr']["$and"].push({ $eq: ["$PutOnSaleType", "FixedPrice"] });

    } 
    else if (TabName == "Staking") {
      SendDta.sort = { "updatedAt": -1 };
      SendDta.tokenOwnerMatch['$expr']["$and"].push(  { $eq: ["$isStakeable", true] },);
     


    }else if (TabName == "PriceHighToLow") {
      SendDta.sort = { "NFTPrice": -1 };
      SendDta.tokenOwnerMatch['$expr']["$and"].push({ $eq: ["$PutOnSaleType", "FixedPrice"] });

    }
    else if (TabName == "FixedPrice") {
      SendDta.sort = { "TokenPrice": 1 };
       SendDta.tokenOwnerMatch['$expr']["$and"].push({ $eq: ["$PutOnSaleType", "FixedPrice"] });

    }
    else if (TabName == "TimedAuction") {
      SendDta.sort = { "EndClockTime": -1 };
      SendDta.tokenOwnerMatch['$expr']["$and"].push({ $eq: ["$PutOnSaleType", "TimedAuction"] });
      SendDta.tokenOwnerMatch['$expr']["$and"].push({ $gt: ["$EndClockTime",  Date.now()] });
    }
    else if (TabName == "UnlimitedAuction") {
      SendDta.sort = { "updatedAt": -1 };

      SendDta.tokenOwnerMatch['$expr']["$and"].push({ $eq: ["$PutOnSaleType", "UnlimitedAuction"] });

    }
    else if (TabName == "Recent") {
      SendDta.sort = { "updatedAt": -1 };

    }
    else if (TabName == "old") {
      SendDta.sort = { "updatedAt": 1 };

    } else { 
       // categories
      var iscategory = true
      var TabNames =
        TabName == "All" || "" ?{ $ne: ["$Category", ""] }:{ $eq: ["$Category", TabName] }
       


      SendDta.TokenMatch['$expr']["$and"].push(TabNames);

      SendDta.sort = { "updatedAt": -1 };
    }
  
  }

  else if (from == "Explore" && isCategory && isCategory == "category") {
 
    SendDta.tokenOwnerMatch = {
      $expr: {
        $and: [
          { $ne: ["$NFTBalance", "0"] },
          { $eq:["$Status", 'list' ]},
          { $eq: ["$HideShow", "visible"] },
          { $eq: ["$NFTId", "$$tId"] },
          { $eq: ["$CollectionName", "$$collname"] },
        ],
      },
    };
  
      var TabNames =
        TabName == "All" || "" ?{ $ne: "" }: TabName
           
      SendDta.TokenMatch = {
        Category: TabNames ,
        HideShow:{$ne:"Hidden"},

      };

    
  
  }
   else if (from == "Auction") {
    
    SendDta.tokenOwnerMatch = {

      $expr: {
        $and: [
          { $ne: ["$NFTBalance", "0"] },
          { $eq: ["$HideShow", "visible"] },
          { $eq: ["$NFTId", "$$tId"] },
          { $eq: ["$PutOnSaleType", "TimedAuction"] },
          { $gt: ["$EndClockTime", new Date()] }
        ],
      },
    };
    if (TabName == "BLTH") {
      SendDta.sort = { "tokenowners_list.NFTPrice": 1 };
      SendDta.TokenMatch = {};
    } else if (TabName == "BHTL") {
      SendDta.sort = { "tokenowners_list.NFTPrice": -1 };
      SendDta.TokenMatch = {};
    } else if (TabName == "OLD") {
      SendDta.sort = { "tokenowners_list.updatedAt": 1 };
      SendDta.TokenMatch = {};
    } else {
      var TabNames =
        TabName == "All" ||
        TabName == "LatestDrops" ||
        TabName == "PriceLowToHigh" ||
        TabName == "PriceHighToLow"
          ? ""
          : TabName;
      SendDta.TokenMatch = {
        Category: TabNames ? TabNames : { $ne: "" },
        HideShow:{$ne:"Hidden"}

      };
      SendDta.sort = { "tokenowners_list.updatedAt": -1 };
    }
  } else if (from == "Sale") {
    SendDta.tokenOwnerMatch = {
      $expr: {
        $and: [
          { $ne: ["$NFTBalance", "0"] },
          { $eq: ["$HideShow", "visible"] },
          { $eq: ["$NFTId", "$$tId"] },
          { $eq: ["$PutOnSaleType", "FixedPrice"] },
          { $ne: ["$NFTPrice", "0"] },
          {
            $and: [
              { $lt: ["$updatedAt", new Date()] },
              {
                $gt: [
                  "$updatedAt",
                  new Date(new Date().setDate(new Date().getDate() - 30)),
                ],
              },
            ],
          },
        ],
      },
    };
    if (TabName == "BLTH") {
      SendDta.sort = { "tokenowners_list.NFTPrice": 1 };
      SendDta.TokenMatch = {};
    } else if (TabName == "BHTL") {
      SendDta.sort = { "tokenowners_list.NFTPrice": -1 };
      SendDta.TokenMatch = {};
    } else if (TabName == "OLD") {
      SendDta.sort = { "tokenowners_list.updatedAt": 1 };
      SendDta.TokenMatch = {};
    } else {
      var TabNames =
        TabName == "All" ||
        TabName == "LatestDrops" ||
        TabName == "PriceLowToHigh" ||
        TabName == "PriceHighToLow"
          ? ""
          : TabName;
      SendDta.TokenMatch = {
        Category: TabNames ? TabNames : { $ne: "" },
        // reported: { $eq: false },
        // reported: { $ne: true },
        HideShow:{$ne:"Hidden"}

      };
      SendDta.sort = { "tokenowners_list.updatedAt": -1 };
    }
  } 
  else if (from == "collection") {
 
if(isStakepage && isGetStake){
  SendDta.tokenOwnerMatch = {
    $expr: {
      $and: [
        { $ne: ["$NFTBalance", "0"] },
        { $eq:['$Status', 'list' ]},
        { $eq: ["$HideShow", "visible"] },
        { $eq: ["$NFTId", "$$tId"] },
        { $eq: ["$isStakeable", true] },
        { $eq: ["$CollectionName",Filter ] },
      ],
    },
  };
}
else if(isGetStake){
  SendDta.tokenOwnerMatch = {
    $expr: {
      $and: [
        { $ne: ["$NFTBalance", "0"] },
        { $eq:['$Status', 'list' ]},
        { $eq: ["$HideShow", "visible"] },
        { $eq: ["$NFTId", "$$tId"] },
        { $eq: ["$isStakeable", true] },
      ],
    },
  };
}
else{
    SendDta.tokenOwnerMatch = {
      $expr: {
        $and: [
          { $ne: ["$NFTBalance", "0"] },
          { $eq:['$Status', 'list' ]},
          { $eq: ["$HideShow", "visible"] },
          { $eq: ["$NFTId", "$$tId"] },
      
        ],
      },
    };

  }
    if (TabName == "LTH") {
     
      SendDta.TokenMatch = { 
        HideShow:{$ne:"Hidden"},

      CollectionSymbol: { $eq: CollectionSymbol },
    };
      SendDta.sort = { "tokenowners_list.TokenPrice": 1 };
    } else if (TabName == "HTL") {
        SendDta.TokenMatch = { 
        HideShow:{$ne:"Hidden"},
        CollectionSymbol: { $eq: CollectionSymbol },
     };
        SendDta.sort = { "tokenowners_list.TokenPrice": -1 };
      }else if (TabName == "OLD") {
        SendDta.TokenMatch = { 
           HideShow:{$ne:"Hidden"},
        CollectionSymbol: { $eq: CollectionSymbol },
    };
        SendDta.sort = { "tokenowners_list.upadatedAt": 1 };
      }else if (TabName == "NOW") {
        SendDta.TokenMatch = { 
          HideShow:{$ne:"Hidden"},

        CollectionSymbol: { $eq: CollectionSymbol },
    };
        SendDta.sort = { "tokenowners_list.upadatedAt": -1 };
      } else {
      var TabNames =
        TabName == "All" ||
        TabName == "LatestDrops" ||
        TabName == "PriceLowToHigh" ||
        TabName == "PriceHighToLow"
          ? ""
          : TabName;
      var categoryOptions =  TabName == "All" ?{ $ne: ["$Category", ""] }: { $in: ["$Category",TabName] }
      SendDta.TokenMatch = {$expr:
        {$and: [
        categoryOptions,      
        { $eq: ["$HideShow", "visible"] }  ,
        { $eq: ["$CollectionName", Filter] }   
        ]}
      }
      SendDta.sort = { "tokenowners_list.updatedAt": -1 };
    }
  }
  
  else  if (from == "mobile"||from == "Swipe") {
    var TabNames = TabName == "All" ? "" : TabName;
      SendDta.TokenMatch = {
        Category: TabNames ? TabNames : { $ne: "" },
        HideShow:{$ne:"Hidden"}
      };
    SendDta.tokenOwnerMatch = {
      $expr: {
        $and: [
          { $ne: ["$NFTBalance", "0"] },
         { $eq: ["$HideShow", "visible"] },
          { $eq: ["$NFTId", "$$tId"] },
        ],
      },
    };

    if (Filter == "buynow") {
      SendDta.sort = { "tokenowners_list.NFTPrice": -1 };
      SendDta.tokenOwnerMatch['$expr']["$and"].push({ $eq: ["$PutOnSaleType", "FixedPrice"] });

    }
  
    else if (Filter == "timedauction") {
      SendDta.sort = { "tokenowners_list.EndClockTime": -1 };
      SendDta.tokenOwnerMatch['$expr']["$and"].push({ $eq: ["$PutOnSaleType", "TimedAuction"] });

    }
    else if (Filter == "unlimitedauction") {
      SendDta.sort = { "tokenowners_list.updatedAt": -1 };
      SendDta.tokenOwnerMatch['$expr']["$and"].push({ $eq: ["$PutOnSaleType", "UnlimitedAuction"] });
    }
    else if (Filter == "pricehightolow") {
      SendDta.sort = { "tokenowners_list.NFTPrice": -1 };
      SendDta.tokenOwnerMatch['$expr']["$and"].push({ $or:[{$eq: ["$PutOnSaleType", "TimedAuction"] },{$eq: ["$PutOnSaleType", "FixedPrice"] }]});
      SendDta.tokenOwnerMatch['$expr']["$and"].push({ $ne: ["$NFTPrice",  '0'] });
    }
    else if (Filter == "pricelowtohigh") {
      SendDta.sort = { "tokenowners_list.NFTPrice": 1 };
      SendDta.tokenOwnerMatch['$expr']["$and"].push({ $or:[{$eq: ["$PutOnSaleType", "TimedAuction"] },{$eq: ["$PutOnSaleType", "FixedPrice"] }]});
      SendDta.tokenOwnerMatch['$expr']["$and"].push({ $ne: ["$NFTPrice",  '0'] });
    }
    else if (Filter == "oldest") {
      SendDta.sort = { "tokenowners_list.updatedAt": 1 };
    }
     else {  // categories
      
      SendDta.sort = { "tokenowners_list.updatedAt": -1 };
    }
  }
  SendDta.Tokens = Tokens;

  SendDta.TabName = TabName;

   if(from == "Explore" && isCategory && isCategory == "category") {
    var RetData = await MongooseHelper.ExploreTokenList_category(SendDta);
  }

  else if(from == "Explore" && isCategory && isCategory == "notcategory") {
    var RetData = await MongooseHelper.ExploreTokenList(SendDta);
  }
  else   {
    var RetData = await MongooseHelper.TokenList(SendDta);
     
  }

  res.json(RetData);
};
export const collectionDetailPage = async(req,res)=>{
  try{
  
  const { TabName, limit, CustomUrl, page, from, CollectionSymbol ,Filter ,isStakepage ,isGetStake,skip} = req.query;
  var SendDta = {};
  SendDta.limit = limit ? parseInt(limit) : Number.MAX_SAFE_INTEGER;
  SendDta.skip =  skip;
  SendDta.CustomUrl = CustomUrl;
  SendDta.from = from;
  if(isStakepage && isGetStake){
  
    SendDta.tokenOwnerMatch = {
      $expr: {
        $and: [
          { $ne: ["$NFTBalance", "0"] },
          // { $eq:['$Status', 'list' ]},
          { $eq: ["$HideShow", "visible"] },
          { $eq: ["$NFTId", "$$tId"] },
          { $eq: ["$CollectionName", "$$collname"] },

          { $eq: ["$isStakeable", true] },
          { $eq: ["$CollectionName",Filter ] },
  
          // { $eq: ["$isStake", false] }
  
  
        ],
      },
    };

  }else{
  SendDta.tokenOwnerMatch = {
    $expr: {
      $and: [
        { $ne: ["$NFTBalance", "0"] },
        // { $eq:['$Status', 'list' ]},
        { $eq: ["$HideShow", "visible"] },
        { $eq: ["$NFTId", "$$tId"] },
        { $eq: ["$CollectionName", "$$collname"] },

    
      ],
    },
  };
}
  {
  SendDta.TokenMatch = {$expr:
    {$and: [
    { $ne: ["$Category", ""] },      
    { $eq: ["$HideShow", "visible"] }  ,
    { $eq: ["$CollectionName", Filter] }   ,

    ]}
  }
  SendDta.sort = { "tokenowners_list.updatedAt": 1 };
  SendDta.Tokens = Tokens;
  SendDta.TabName = TabName;

  var RetData = await MongooseHelper.ExploreTokenList_category(SendDta);
  res.json(RetData);


  }
}
  catch(err){
   console.log("colleciton page err",err)
  }
}





export const updateTime = async (req, res) => {

  var owners = await TokenOwners.find()
  Promise.all(
    owners.map(async (owner) => {

      var nftsave = await TokenOwners.findOneAndUpdate({ NFTId: owner.NFTId },
        {
          $set: {
            createdAt: owner.timestamp,
            updatedAt: owner.timestamp
          }
        },
        { new: true })

    })
  )

}

export const GetCreatedCollections = async (req, res) => {
  try {
    var data = await collectionSchema.find(req.query)
    res.status(200).json({ status: true, data: data })
  } catch (err) {
    res.status(200).json({ status: false, data: [] })
  }
}

 
 //Get NFT Info
 export const info = async (req, res) => {
  const { Contract, Owner, Id, TabName, page, MyAdd, limit } = req.query;
  var SendDta = {},
    Bid = {},
    highBid = {},
    myBid = {};
  SendDta.NFTOwner = Owner;
  SendDta.NFTId = Id;
  SendDta.TokenMatch = {
    $and: [
      { NFTId: { $eq: Id } },
      { ContractAddress: { $eq: Contract } },
      { HideShow: { $ne: "Hidden" } }
      // {reported:{$ne: true}}
    ]


  };
  SendDta.limit = parseInt(limit) ?? 1;
  SendDta.skip = ((page ? parseInt(page) : 1) - 1) * limit;
  SendDta.sort = { "tokenowners_list.updatedAt": 1 };
  SendDta.tokenOwnerMatch = {
    $expr: {
      $and: [
        { $ne: ["$NFTBalance", "0"] },
        //    { '$eq':['$Status', 'list' ]},
        { $eq: ["$HideShow", "visible"] },
        { $eq: ["$NFTId", "$$tId"] },
        { $eq: ["$CollectionName", "$$collname"] },

      ],
    },
  };
  SendDta.myowner = {
    $expr: {
      $and: [
        { $ne: ["$NFTBalance", "0"] },
        { $eq: ["$NFTOwner", MyAdd] },
        { $eq: ["$HideShow", "visible"] },
        { $eq: ["$NFTId", "$$tId"] },
        { $eq: ["$CollectionName", "$$collname"] },

      ],
    },
  };
  myBid.BidMatch = {
    $expr: {
      $and: [
        { $eq: ["$NFTId", Id] },
        { $eq: ["$TokenBidderAddress", MyAdd] },
        { $eq: ["$ContractAddress", Contract] },
        { $eq: ["$deleted", 1] },
        {
          $or: [
            { $eq: ["$status", "pending"] },
            { $eq: ["$status", "partiallyComplete"] },
          ],
        },
      ],
    },
  };
  myBid.sort = { updatedAt: -1 };
  highBid.BidMatch = {
    $expr: {
      $and: [
        { $eq: ["$NFTId", Id] },
        { $eq: ["$ContractAddress", Contract] },
        { $eq: ["$deleted", 1] },
        {
          $or: [
            { $eq: ["$status", "pending"] },
            { $eq: ["$status", "partiallyComplete"] },
          ],
        },
      ],
    },
  };
  highBid.sort = { TokenBidAmt: -1 };

  if (TabName != "owner") {
    SendDta.tokenOwnerMatch["$expr"]["$and"].push({
      $eq: ["$NFTOwner", Owner],
    });
  }
  if (TabName == "bid") {
    Bid.BidMatch = {
      $expr: {
        $and: [
          { $eq: ["$NFTId", Id] },
          { $eq: ["$ContractAddress", Contract] },
          { $eq: ["$deleted", 1] },
          {
            $or: [
              { $eq: ["$status", "pending"] },
              { $eq: ["$status", "partiallyComplete"] },
            ],
          },
        ],
      },
    };
    Bid.sort = { TokenBidAmount: -1 };
  }
  if (TabName == "activity") {
  }
  SendDta.Tokens = Tokens;
  SendDta.TabName = TabName;
  var explore = {
    DBName: TokenOwners,
    limit: 4,
    MyAdd: MyAdd,
    sort: { updatedAt: -1 },
    match: {
      $expr: {
        $and: [
          { $ne: ["$NFTBalance", "0"] },
          { $eq: ["$NFTOwner", Owner] },
          { $eq: ["$HideShow", "visible"] },
        ],
      },
    },
  };
  var RetData = {};
  RetData.token = await MongooseHelper.TokenInfo(SendDta);
  RetData.Explore = await MongooseHelper.Explore(explore);
  Bid.DBName = Bids;
  myBid.DBName = Bids;
  highBid.DBName = Bids;
  RetData.Bid =
    TabName == "bid" ? await MongooseHelper.BidInfo(Bid, SendDta) : [];
  RetData.myBid = await MongooseHelper.BidInfo(myBid, SendDta);
  RetData.highBid = await MongooseHelper.BidInfo(highBid, SendDta);
  RetData.UnlockContent = [];
  res.json(RetData);
};

//Place Order
export const CreateOrder = async (req, res) => {
  try {
    const {
      click,
      CollectionNetwork,
      CollectionName,
      NFTId,
      NFTName,
      Category,
      NFTDescription,
      NFTOrginalImage,
      NFTThumpImage,
      UnlockContent,
      ContractAddress,
      ContractType,
      NFTRoyalty,
      NFTProperties,
      CompressedFile,
      CompressedThumbFile,
      NFTOrginalImageIpfs,
      NFTThumpImageIpfs,
      MetaData,
      NFTCreator,
      NFTQuantity,
      PutOnSale,
      PutOnSaleType,
      NFTPrice,
      CoinName,
      ClockTime,
      EndClockTime,
      HashValue,
      NFTOwner,
      activity,
      NFTBalance,
    } = req.body;
    var TokenADd = await TokenOwnerADD(
      {
        CollectionNetwork,
        CollectionName,
        NFTId,
        NFTName,
        Category,
        NFTDescription,
        NFTOrginalImage,
        NFTThumpImage,
        UnlockContent,
        ContractAddress,
        ContractType,
        NFTRoyalty,
        NFTProperties,
        CompressedFile,
        CompressedThumbFile,
        NFTOrginalImageIpfs,
        NFTThumpImageIpfs,
        MetaData,
        NFTCreator,
        NFTQuantity,
        activity,
        from: "MarketPlace",
      },
      {
        PutOnSale,
        PutOnSaleType,
        NFTPrice,
        CoinName,
        ClockTime,
        EndClockTime,
        HashValue,
        NFTOwner,
        NFTBalance,
      }
    );
    await MongooseHelper.Activity({
      From:
        activity === "Mint"
          ? "NullAddress"
          : activity === "TransfersFiat"
            ? NFTCreator
            : NFTOwner,
      To: activity === "Mint" ? NFTCreator : NFTOwner,
      Activity: activity,
      NFTPrice: NFTPrice,
      Type: PutOnSale ? PutOnSaleType : "Not For Sale",
      CoinName: CoinName,
      NFTQuantity: NFTQuantity,
      HashValue: HashValue,
      NFTId: NFTId,
      ContractType: ContractType,
      ContractAddress: ContractAddress,
      CollectionNetwork: CollectionNetwork,
      CollectionName: CollectionName,
      Category: Category,
    });
    res.json(TokenADd);
  } catch (e) {
    return res.json({ success: "error", mgs: [], catch: e });
  }
};

//Buy NFT
export const BuyAccept = async (req, res) => {
  let List = await BUY_ACCEPT_FUNC(req.body.item, req.body.newOwner);

  if (List?.success === "success") {
    await MongooseHelper.Activity({
      From: req.body.newOwner.NFTOwner,
      To: req.body.newOwner.NewTokenOwner,
      Activity: req.body.newOwner.activity,
      NFTPrice: req.body.newOwner.TP,
      CoinName: req.body.newOwner.CN,
      NFTQuantity: req.body.newOwner.Quantity,
      HashValue: req.body.newOwner.HashValue,
      NFTId: req.body.item.NFTId,
      CollectionNetwork: req.body.item.CollectionNetwork,
      ContractType: req.body.item.ContractType,
      ContractAddress: req.body.item.ContractAddress,
      CollectionName: req.body.newOwner.CollectionName,

      Category: req.body.item.Category,
    });
  }
  return res.json(List);
};

const BUY_ACCEPT_FUNC = async (item, newOwner) => {
  try {
    const { NFTId, ContractAddress, ContractType, NFTCreator } = item;
    const {
      NFTPrice,
      HashValue,
      NFTQuantity,
      NewTokenOwner,
      PutOnSale,
      PutOnSaleType,
      NFTOwner,
      activity,
      CollectionName,
      usdprice,
      usdvolume,
      isStakeable,
      backedValue
    } = newOwner;
    if (NFTOwner) {
      let data = {
        DBName: TokenOwners,
        FinData: { NFTOwner: NFTOwner, NFTId: NFTId ,CollectionName:CollectionName},
        SelData: {},
      };
     
      let List = await MongooseHelper.FindOne(data);
     
      if (List.msg) {
        let Quantitys = Number(List.msg.NFTBalance) - Number(NFTQuantity);
        var TokenADd = await TokenOwnerADD(
          { NFTId, ContractAddress, ContractType, NFTCreator },
          {
            NFTOwner,
            PutOnSaleType,
            PutOnSale,
            NFTBalance: Quantitys.toString(),
            CollectionName:CollectionName,
 
          }
        );
        if (TokenADd.success === "success") {
          let datas = {
            DBName: TokenOwners,
            FinData: { NFTOwner: NewTokenOwner, NFTId: NFTId ,CollectionName:CollectionName},
            SelData: {},
          };
          let Lists = await MongooseHelper.FindOne(datas);
         

          var TokenADd1 = await TokenOwnerADD(
            { NFTId, ContractAddress, ContractType, NFTCreator },
            {
              NFTOwner: NewTokenOwner,
              NFTQuantity: String(List?.msg?.NFTQuantity),
              NFTBalance: Lists?.msg?.NFTBalance
                ? String(Number(Lists?.msg?.NFTBalance) + Number(NFTQuantity))
                : NFTQuantity,
              HashValue,

              CollectionName:CollectionName,
              isStakeable:isStakeable,
              backedValue:backedValue,
              SaleStatus:(PutOnSaleType == "FixedPrice")?"Sold":""

 
            }
          );

          var updateCollection = await CollectionSchema.findOne({ collectionName: CollectionName })
         
          if (updateCollection) {
            var upddata = {
              floorPrice: (updateCollection.floorPrice && Number(updateCollection.floorPrice) < usdprice)
                ? updateCollection.floorPrice : usdprice,
              volume: (updateCollection.volume) ? Number(updateCollection.volume) + usdvolume : usdvolume
            }
           
            var updatestatus = await CollectionSchema.findOneAndUpdate({ collectionName: CollectionName }, { $set: upddata }, { new: true })
           
          }
          return TokenADd1;
        } else return TokenADd;
      }
    } else return List;
  } catch (e) {
    return { success: "error", mgs: [] };
  }

};


//Bid NFT
export const BidAction = async (req, res) => {

  const {
    activity,
    EmailId,
    Category,
    TokenBidderAddress,
    CollectionNetwork,
    TokenBidderAddress_Name,
    HashValue,
    TokenBidAmt,
    ContractType,
    ContractAddress,
    NFTId,
    from,
    NFTOwner,
    CoinName,
    click,
  } = req.body;
  const NFTQuantity = Number(req.body.NFTQuantity);
  let data = {
    DBName: Bids,
    FinData: {
      TokenBidderAddress: TokenBidderAddress,
      NFTId: NFTId,
      ContractAddress: ContractAddress,
      ContractType: ContractType,
      deleted: 1,
      Pending: { $gt: 0 },
    },
    SelData: {},
  };
  let List = await MongooseHelper.FindOne(data);
  if (List.success == "success") {
    let update = req.body;
    if (from == "Edit") {
      update.NFTQuantity = NFTQuantity;
      update.Pending = NFTQuantity - List.msg.Completed;
      update.status = "pending";
    } else if (from == "Cancel") {
      update.Pending = List.msg.Pending - List.msg.Pending;
      update.Cancel = List.msg.Cancel + List.msg.Pending;
      update.status = "cancelled";
    } else if (from == "accept") {
      update.Pending = List.msg.Pending - NFTQuantity;
      update.status = List.msg.Pending == NFTQuantity ? "completed" : "pending";
      update.Completed =
        List.msg.Pending == NFTQuantity
          ? NFTQuantity
          : List.msg.Completed + NFTQuantity;
    }
    var finVal = {
      DBName: Bids,
      FinData: data.FinData,
      Updata: update,
      save: { new: true },
    };
    var Finds = await MongooseHelper.FindOneAndUpdate(finVal);
   
 
   if (from == "accept") {
     var tok = await BUY_ACCEPT_FUNC(req.body.item, req.body.newOwner);
     await MongooseHelper.Activity({
       From: req.body.newOwner.NFTOwner,
       To: req.body.newOwner.NewTokenOwner,
       Activity: req.body.newOwner.activity,
       NFTPrice: req.body.newOwner.TP,
       CoinName: req.body.newOwner.CN,
       NFTQuantity: req.body.newOwner.NFTQuantity,
       HashValue: req.body.newOwner.HashValue,
       NFTId: req.body.item.NFTId,
       CollectionNetwork: req.body.item.CollectionNetwork,
       ContractType: req.body.item.ContractType,
       ContractAddress: req.body.item.ContractAddress,
       CollectionName: req.body.newOwner.CollectionName,
       Category: Category,
     });
     res.json(tok);
   } else {
     if ((from == "Edit" || from == "Cancel") && Finds.success === "success") {
      
       await MongooseHelper.Activity({
         From: NFTOwner,
         To: TokenBidderAddress,
         Activity: activity,
         NFTPrice: TokenBidAmt,
         CoinName: CoinName,
         NFTQuantity: (from == "Cancel")?List.msg.Pending:NFTQuantity,
         HashValue: HashValue,
         NFTId: NFTId,
         ContractType: ContractType,
         ContractAddress: ContractAddress,
         CollectionNetwork: CollectionNetwork,
         CollectionName: req.body.CollectionName,
         Category: Category,
       });
     }
     res.json(Finds);
   }
 } else {
   let datas = {
     DBName: Bids,
     Data: req.body,
   };
   datas.Data.Pending = NFTQuantity;
   let List = await MongooseHelper.Save(datas);
   if (List.success === "success") {
    
     await MongooseHelper.Activity({
       From: NFTOwner,
       To: TokenBidderAddress,
       Activity: activity,
       NFTPrice: TokenBidAmt,
       CoinName: CoinName,
       NFTQuantity: NFTQuantity,
       HashValue: HashValue,
       NFTId: NFTId,
       Category: Category,
       ContractType: ContractType,
       ContractAddress: ContractAddress,
       CollectionNetwork: CollectionNetwork,
       CollectionName: req.body.CollectionName,

     });
   }
   
   res.json(List);
 }
 
};


// search 
 
export const SearchAction = async(req,res) => {
  const { keyword,limit,page ,from} = req.query

  var SendDta =   {}
  SendDta.limit = parseInt(limit) ?? 1
  SendDta.skip   = from == "mobile" ? 0 :  ((page ? parseInt(page) : 1 ) - 1) * limit
  SendDta.from = from
  SendDta.sort = {'updatedAt':-1}
  SendDta.ProfileUrl = '';

  SendDta.tokenOwnerMatch = {
      $expr:{ '$and':[
          { '$ne':['$NFTBalance' , '0'] },
          // { '$eq':['$Status', 'list' ]},
          { '$eq':['$HideShow', 'visible' ]},
          { '$eq':['$NFTId','$$tId']},
      ]
      }
  }
  SendDta.TokenMatch = {
      HideShow:{$ne:"Hidden"},
      NFTName: {"$regex" : req.query.keyword , "$options" : "ix" }
  }
  SendDta.user = {
      DisplayName: { "$regex" : req.query.keyword, "$options" : "ix" }
   
  }

  SendDta.collectionMatch = {
    isHidden:{$ne:true},
    collectionName: {"$regex" : req.query.keyword , "$options" : "ix" }
}
   SendDta.Tokens = Tokens
   var Retdata = {}
   if(from == "mobile"){
    let nft = await MongooseHelper.TokenList(SendDta)
     let usr = await UserSearch(SendDta)

     Retdata.data = {
      NFTS : nft.data,
     USERS :usr.msg
    }
    }
    else{
     Retdata.token = await MongooseHelper.TokenList(SendDta);
     Retdata.user = await UserSearch(SendDta);
     Retdata.collection = await CollectionSearch2(SendDta)

   }
   Retdata.from =from;
   return res.json(Retdata)
}

// search bar

export const SearchActionBar = async(req,res)=>{
  try{

    var CollecitonData = await CollectionSchema.find({collectionName:{"$regex" : req.query.keyword , "$options" : "i" },HideShow:{$ne:"Hidden"}},
                                                     {collectionName:1,isImported:1,contractAddress:1,Creator:1,customUrl:1,profileImage:1})
                                               .limit(req.query.limit)

    var UserData = await userSchema.find({DisplayName:{"$regex" : req.query.keyword , "$options" : "i" }},
                                         {DisplayName:1,Profile:1,WalletAddress:1,CustomUrl:1}).limit(req.query.limit)
    

    var tokendata = await Tokens.find({NFTName:{"$regex" : req.query.keyword , "$options" : "i" },
                                       HideShow:{$ne:"Hidden"}},
                                      {NFTName:1,
                                       NFTOrginalImage:1,
                                       NFTThumpImage:1,
                                       NFTId:1,
                                       ContractAddress:1,
                                       CollectionNetwork:1,
                                       fileType:1
                                      })
                                      .sort({updatedAt:-1})
                                      .limit(req.query.limit)
    if(tokendata.length > 0){

      var TokenDetails = tokendata
      await Promise.all(
        await tokendata.map(async(tok,i)=>{
           
          var ownerdata = await TokenOwners.find({
                                  NFTId:tok.NFTId,
                                  NFTBalance:{$ne:"0"},
                                  HideShow:{$eq:"visible"}})
                                 .sort({updatedAt:-1}).limit(1)
          if(ownerdata.length == 0) TokenDetails.splice(i,1)
          else TokenDetails[i].NFTOwner = ownerdata[0].NFTOwner
        }),
      )
     var tokenownerdata = TokenDetails
      

    }
    else var tokenownerdata = []
    res.status(200).json({status:true,data:{token:tokenownerdata,users:UserData,collections:CollecitonData}})
    
  }
  catch(err){
    res.status(200).json({status:false,data:[]})
  }
}






const UserSearch = async (data) => {
  let datas = {
    DBName: userSchema, FinData: data.user, SelData: {}, limit: data.limit, skip: data.skip
  }
  let List = await MongooseHelper.Find(datas)
  return List
}
const CollectionSearch2 = async(data)=>{
  let datas = {
      DBName: CollectionSchema, FinData:  data.collectionMatch , SelData: {} ,limit : data.limit , skip:data.skip
  }
  let List = await MongooseHelper.Find(datas)
 
  return List
}

const CollectionSearch = async(data)=>{
  try{

  var getSearchCollection = await CollectionSchema.find(
    { isHidden: { '$ne': true },
      collectionName:data.collectionMatch.collectionName
    }
  ).limit(3)
  return {success:"success",msg:getSearchCollection}

}
  catch(err){
    return {success:"error",msg:[]}
  }
}


// Report NFT

export const Report = async (req, res) => {
  const { NFTId, ContractAddress, ContractType, NFTCreator, CollectionNetwork, Address, Message, CustomUrl } = req.body
  let data = {
    DBName: Tokens, FinData: { NFTId, ContractAddress, ContractType, NFTCreator, CollectionNetwork, ReportBy: { $elemMatch: { 'Address': Address, 'CustomUrl': CustomUrl } } }, SelData: { _id: 0 }
  }
  let List = await MongooseHelper.Find(data)
  var finVal = { DBName: Tokens, FinData: { NFTId, ContractAddress, ContractType, NFTCreator, CollectionNetwork }, Updata: List?.msg[0]?.ReportBy.length > 0 ? { $push: { ReportBy: { Address: Address, Message: Message, CustomUrl: CustomUrl } } } : { $set: { 'reported': true, 'ReportBy': [{ Address: Address, Message: Message, CustomUrl: CustomUrl }] } }, save: { new: true } }
  const Finddata = await MongooseHelper.FindOneAndUpdate(finVal) 
  res.json({ success: Finddata.success, msg: Finddata.data ? 'Reported Successfully' : 'Try Again' })
}

// Burn Update

export const BurnUpdate = async (req, res) => {

  const { NFTId, ContractAddress, ContractType, NFTCreator } = req.body.item;


  var finVal = {
    DBName: TokenOwners,
    FinData: {
      NFTId: NFTId,
      NFTOwner: req.body.newOwner.NFTOwner,
      CollectionName: req.body.newOwner.CollectionName

    },
    Updata: {
      NFTBalance: req.body.newOwner.NFTBalance,
      burnToken: req.body.newOwner.burnQunatity
    },
    save: { new: true },
  };
  var List = await MongooseHelper.FindOneAndUpdate(finVal);
  if (List?.success === "success") {
    await MongooseHelper.Activity({
      From: req.body.newOwner.NFTOwner,
      // To: req.body.newOwner.NewTokenOwner,
      Activity: req.body.newOwner.activity,
      NFTQuantity: req.body.newOwner.burnQunatity,
      HashValue: req.body.newOwner.HashValue,
      NFTId: req.body.item.NFTId,
      CollectionNetwork: req.body.item.CollectionNetwork,
      ContractType: req.body.item.ContractType,
      ContractAddress: req.body.item.ContractAddress,
      Category: req.body.item.Category,
      CollectionName: req.body.newOwner.CollectionName

    });
  }
  return res.json(List);
};

export const GetPromotedToken = async (req, res) => {
  var resp = await MongooseHelper.PromotedTokens({ DBName: TokenOwners })
  res.json(resp)
}
 
export const GetPromotedCollection = async(req,res)=>{
  const {from} = req.query
  var resp = await MongooseHelper.PromotedCollections({DBName:collectionSchema,from})
 
  res.json(resp)
}

// List All Nfts
export const ListNFtFunc = async (req, res) => {

  try {
   
    var unReportedNfts = await Tokens.find({"isReported":false},{"NFTId":1})

    if(unReportedNfts){
    
     var success =  Promise.all(
        unReportedNfts.map(async(nft)=>{

          var findData =  { $and: [
 
                          { NFTId: { $eq: nft.NFTId } }, 
                          { NFTOwner: { $eq: req.body.NFTOwner } } ,
                          { Status: { $eq: req.body.Status } } ,
                          { CollectionName : { $eq: req.body.collectionName }}
                            
                          ] } 

          var resp = await TokenOwners.findOneAndUpdate(findData,{
            $set: { "PutOnSale" : true,"PutOnSaleType" : "UnlimitedAuction" ,"Status":"list"}},
            {new:true}
 
          )

        })
      )

      if (success)
        res.status(200).json({ status: true, msg: "Successfully Listed." })


    }

  }
  catch (err) {
    res.status(200).json({ status: false, msg: "failed to lis nfts." })
  }

}



export const getcollectiondata = async (req, res) => {
  try {

    var collData = await collectionSchema.findOne(req.query)
    if (collData) {
 
      var collectionOwnersCount = await TokenOwners.find({
        $and: [
          { NFTBalance: { $ne: "0" } },
          { CollectionName: { $eq: collData.collectionName } }
        ]
      }).count()

      collData["ownersCount"] = collectionOwnersCount

      if (collData.isImported) {

        var fullArr = collData.importednfts
 
 
        var NewArr = collData.importednfts.length > 10 ? collData.importednfts.slice(0, 10) : collData.importednfts

        NewArr.map((val) => {
 
          if (val.NFTImage == "") testImageAxios(val,req.query.customUrl)
 
        })
        collData.importednfts = NewArr
      }

      if (collData?.isStakeable) {
        var pooldata = await StakingPool.find({ collectionId: collData._id })
        if (pooldata?.length > 0) { var stakingpool = pooldata[0] }
        else { var stakingpool = "" }
      }

 
      if(collData?.collectionType == "721" || collData?.collectionType == 721){
        var tokCount = await TokenOwners.find({ CollectionName:collData?.collectionName,NFTBalance:{$ne:0}})
      }

      res.status(200).json({ status: true, msg: "found data.",fullArr:fullArr, data: collData, ownerscount: collectionOwnersCount ? collectionOwnersCount : 0, stakingpool: stakingpool ,tokCount:tokCount?.length > 0? tokCount?.length :0})
 
    }
  } catch (err) {
    res.status(200).json({ status: false, msg: "failed to get data.", data: {} })

  }

}



export const Tokenlistfunc2 = async (req, res) => {
  const { TabName, limit, CustomUrl, page, from, CollectionSymbol, Filter } = req.query;


  var SendDta = {};
  SendDta.limit = limit ? parseInt(limit) : Number.MAX_SAFE_INTEGER;
  
  SendDta.skip = 0;

  SendDta.CustomUrl = CustomUrl;
  SendDta.from = from;

  if (from == "Explore") {

    SendDta.tokenOwnerMatch = {
      $expr: {
        $and: [
          { $ne: ["$NFTBalance", "0"] },
          { $eq: ["$Status", 'list'] },
          { $eq: ["$HideShow", "visible"] },
          { $eq: ["$NFTId", "$$tId"] },
        ],
      },
    };





    var TabNames = TabName == "All" ? "" : TabName;

    var categoryOptions = TabName == "All" ? { $ne: ["$Category", ""] } : { $in: ["$Category", TabName] }
    SendDta.TokenMatch = {
      $expr:
      {
        $and: [

          categoryOptions,
          { $eq: ["$HideShow", "visible"] }

        ]
      }

    }
  }

  SendDta.Tokens = Tokens;

  SendDta.TabName = TabName;

  var RetData = await MongooseHelper.TokenList(SendDta);
  res.json(RetData);
};


// newly minted creations for homepage section

export const NewNFts = async (req, res) => {

  try {

    var data = await Tokens.aggregate([
      { $match: { HideShow: "visible" } },
      { $sort: { createdAt: -1 } },
      { $limit: 8 },
      {
        $lookup: {
          from: "tokenowners",
          let: { tokenid: "$NFTId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $ne: ["$NFTBalance", "0"] },
                    { $eq: ["$Status", 'list'] },
                    { $eq: ["$HideShow", "visible"] },
                    { $eq: ["$NFTId", "$$tokenid"] },
                  ],
                },
              }
            },
            { $sort: { createdAt: -1 } },
            { $limit: 1 }
          ],
          as: "recentnfts"
        }
      },
      {
        $unwind: {
          path: "$recentnfts",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          NFTId: 1,
          NFTName: 1,
          NFTOrginalImage: 1,
          NFTThumpImage: 1,
          CompressedFile: 1,
          CompressedThumbFile: 1,
          ContractAddress: 1,
          ContractType: 1,
          ContractName: 1,
          NFTCreator: 1,
          NFTRoyalty: 1,
          CollectionNetwork: 1,
          NFTOwner: "$recentnfts.NFTOwner"

        }
      }


    ])

    res.status(200).json({ status: true, data: data, msg: "new nfts" })

  }
  catch (err) {
    res.status(200).json({ status: false, data: [], msg: "failed to get new nfts" })
  }

}


 
export const checkIfTokenExists = async(req,res)=>{
  
  var data = await Tokens.find({NFTId:req.body.NFTId,ContractAddress:req.body.ContractAddress})
  if(data.length > 0){
    res.status(200).json({status:true,msg:"tokenexists"})
  }
  else{
    res.status(200).json({status:false,msg:"token does not exists"})

  }
 

  var isOwnerPresent = await userSchema.find({WalletAddress:req.body.NFTOwner})
  if(isOwnerPresent.length == 0){
    var addNewUser = new userSchema({WalletAddress:req.body.NFTOwner,_id:req.body.NFTOwner})  
    var addedowner = await addNewUser.save()
  }


}

// List All imported nfts of a particular collection

export const ListImportedNfts = async(req,res)=>{
  try{
     var collection = await collectionSchema.find(req.body.collectionFilter)
 
  if(collection?.length >0 && collection[0].importednfts){
  
    var NFTArr = collection[0].importednfts
    var nftArr = []
    var toSaveArr = []



    await Promise.all(
      await NFTArr.map(async(nft, i) => {
        if (String(nft.NFTOwner).toLowerCase() == String(req.body.walletAccount).toLowerCase() && nft?.NFTName) {
            nft.collectionCreator = req.body.collectionFilter?.Creator
            nft.CollectionName = req.body?.collectionName
  
            nftArr.push(nft)
        }
    }),
    )

await Promise.all(
  await nftArr.map(async(nft)=>{


    var datalen = await Tokens.find({NFTId:nft.NFTId,CollectionName:nft.CollectionName})
    if(datalen <= 0){

  var obj = { 
  CollectionNetwork:nft.CollectionNetwork,
  CollectionName:nft.CollectionName,
  NFTId:nft.NFTId,
  NFTName:nft.NFTName,
  // NFTName:"testinsermany",

  Category:"",
  NFTDescription:nft.NFTDescription ,
  NFTOrginalImage:nft.NFTImage,
  NFTThumpImage:"",
  UnlockContent:"",
  CollectionSymbol:"",
  ContractAddress:nft.contractAddress,
  ContractType:nft.contractType,
  NFTRoyalty:nft.royalty,
  NFTProperties:[],
  CompressedFile:"",
  CompressedThumbFile:"",
  NFTOrginalImageIpfs:"",
  NFTThumpImageIpfs:"",
  MetaData:"",
  MetFile:"",
  NFTCreator:nft.NFTCreator,
  NFTQuantity:nft.contractType == 721?1:nft.quantity,
  PutOnSale:true,
  PutOnSaleType:"UnlimitedAuction",
  NFTPrice:0,
  CoinName:"",
  ClockTime:null,
  EndClockTime:null,
  HashValue:"",
  NFTOwner:nft.NFTOwner,
 //  activity:"import",
  NFTBalance:nft.contractType == 721?1:nft.quantity,
  fileType:nft.fileType
 }
 toSaveArr.push(obj)
     }
     else{
      var ownerresp = await TokenOwners.findOneAndUpdate({
        NFTId:nft.NFTId,
        NFTOwner:String(nft.NFTOwner).toLowerCase(),
        CollectionName:nft.CollectionName,
        PutOnSale:false,
        Status:"not-list"
      },{$set:{PutOnSale:true,PutOnSaleType:"UnlimitedAuction",Status:"list"}},{new:true})
     }
     }) 
)
    if(toSaveArr.length == 0) return res.status(200).json({status:true,msg:"Successfully Listed"})


     var saveddata =  await Tokens.insertMany(toSaveArr)
     var ownerdata =  await TokenOwners.insertMany(toSaveArr)
     var updateCollectionCount = await collectionSchema.findOneAndUpdate({collectionName: req.body?.collectionName,
                                                                          Creator:req.body.collectionFilter?.Creator},{$inc:{collectionCount:toSaveArr.length}},{new:true})
     res.status(200).json({status:true,msg:"Successfully Listed"})
     }  
  }
  catch(err){
    res.status(200).json({status:true,msg:"Successfully Listed"})
  }}

export const Findupdatebalance = async (req, res) => {
  var ReqBody = req.body;
  var NFTId = String(ReqBody.NFTId); //changed
  var NFTBalance = Number(ReqBody.NFTBalance);
  var NFTOwner = ReqBody.NFTOwner;
  var finddata = { DBName: TokenOwners, FinData: { NFTOwner: NFTOwner, NFTId: NFTId }, SelData: { _id: 0, NFTQuantity: 1, NFTBalance: 1 } }
  var checkExistingbalance = await MongooseHelper.FindOne(finddata)
  // checkExistingbalance = checkExistingbalance.shift();

  if (checkExistingbalance.success == "success") {
    if (Number(checkExistingbalance.msg.NFTBalance) != Number(NFTBalance)) {
      var Updata = {}
      if (Number(checkExistingbalance.msg.NFTBalance) < Number(NFTBalance)) {
        Updata = {
          NFTBalance: Number(NFTBalance)
        }
      }
      else {
        Updata = {
          NFTBalance: Number(NFTBalance)
        }
      }
      var updatedData = await MongooseHelper.FindOneAndUpdate({ DBName: TokenOwners, FinData: { NFTOwner: NFTOwner, NFTId: NFTId }, Updata: Updata, save: { new: true } });
      return res.json(updatedData)
    }
  }
  return res
    .status(200)
    .json({ success: true });
}


export const addToCart = async (req, res) => {

  try {

    var alreadyAdded = await cartSchema.find(req.body)
    if (alreadyAdded && alreadyAdded.length > 0) return res.status(200).json({ status: true, msg: "Added to cart" })

    var cartdata = new cartSchema(req.body)
    var data = await cartdata.save()
    res.status(200).json({ status: true, msg: "Added to cart" })
  }
  catch (err) {
    res.status(200).json({ status: false, msg: "failed to add to cart" })
  }
};




export const getCartItems = async(req,res)=>{
    try{
       var resp = await cartSchema.aggregate([
        {$match:{buyerAddress:req.query.buyerAddress}},
        {$lookup:{
            from:"tokenowners",
            let:{tokenid:"$NFTId",owner:"$NFTOwner",
                "collname":"$CollectionName"
           },
            pipeline: [
                  { $match:
                     { $expr:
                        { $and:
                           [
                             { $eq: [ "$NFTId",  "$$tokenid" ] },
                             { $eq: [ "$NFTOwner", "$$owner" ] },
                             { $eq: [ "$PutOnSale", "true" ] },
                             { $eq: [ "$PutOnSaleType", "FixedPrice" ] },
                             { $gt: [ "$NFTBalance",  0 ] },
                             { $eq: [ "$Status",  "list" ] },
                             { $ne: [ "$isStake",  true ] },
  
                             {
                                "$eq": [
                                    "$CollectionName",
                                    "$$collname"
                                ]
                            }
                      
                           ]
                        }
                     }
                  } 
               ],
               as: "cartdata"
            }},
         {
         $unwind: { path: "$cartdata", preserveNullAndEmptyArrays: true }
       },
       {$lookup:{
        from:"tokens",
        let:{tokenid:"$NFTId","cartcollection":"$CollectionName"},
        pipeline: [
              { $match:
                 { $expr:
                    { $and:
                       [
                         { $eq: [ "$NFTId",  "$$tokenid" ] },
                         { $eq: [ "$HideShow", "visible" ] },
                         {
                          "$eq": [
                              "$CollectionName",
                              "$$cartcollection"
                          ]
                      }
                       ]
                    }
                 }
              } 
           ],
           as: "tokendata"
        }},
     {
     $unwind: { path: "$tokendata", preserveNullAndEmptyArrays: true }
     },
   
   
   { $project: {
       _id: 0 ,
       buyerAddress:1,
       NFTId:1,
       NFTOwner:1,
       fileType:1,
       ContractAddress:1,
       ContractType:1,
       NFTPrice:"$cartdata.NFTPrice",
       CoinName:"$cartdata.CoinName",
       NFTName:"$tokendata.NFTName",
       NFTOrginalImage:"$tokendata.NFTOrginalImage",
       NFTBalance:"$cartdata.NFTBalance",
       CollectionName:"$cartdata.CollectionName",
       NFTRoyalty:"$tokendata.NFTRoyalty",
       NFTCreator:"$tokendata.NFTCreator",
       NFTThumpImage:"$tokendata.NFTThumpImage",
       PutOnSale:"$cartdata.PutOnSale",
       PutOnSaleType:"$cartdata.PutOnSaleType",
       quantity:1
     
       } }
    ])
        res.status(200).json({status:true,data:resp,msg:"cart items"})
    }
    catch(err){
      res.status(200).json({status:false,data:[],msg:"no items found"})
    }
  };


export const cartPurchase = async (req, res) => {
  try {
    var toupdatedatas = req.body

    await Promise.all(
      await toupdatedatas.map(async (data, i) => {
        var List = await BUY_ACCEPT_FUNC(data.item, data.newOwner)
        if (List?.success === "success") {

 
        await cartSchema.findOneAndRemove({
          NFTId:data?.item?.NFTId,
          NFTOwner:data?.newOwner?.NFTOwner,
          buyerAddress:data?.newOwner?.NewTokenOwner,
          ContractAddress:data?.item?.ContractAddress,
          ContractType:data?.item?.ContractType,
          CollectionName: data.newOwner.CollectionName,

        })

        await MongooseHelper.Activity({
          From: data.newOwner.NFTOwner,
          To: data.newOwner.NewTokenOwner,
          Activity:data.newOwner.activity,
          NFTPrice:  data.newOwner.TP,
          CoinName: data.newOwner.CN,
          NFTQuantity: data.newOwner.Quantity,
          HashValue: data.newOwner.HashValue,
          NFTId: data.item.NFTId,
          CollectionNetwork: data.item.CollectionNetwork,
          ContractType: data.item.ContractType,
          ContractAddress: data.item.ContractAddress,
          Category: data.item.Category,
          CollectionName: data.newOwner.CollectionName,

        });
      }
 

      })

    )

    res.status(200).json({ status: true, msg: "successfully purchased" })

  }
  catch (err) {
    res.status(200).josn({ status: false, msg: "failed " })
  }
}




export const UpdateCart = async (req, res) => {
  try {
    if (req.body.filter == "edit") {
      var data = await cartSchema.findOneAndUpdate(req.body.finddata, { $set: req.body.updatedata }, { new: true })
      res.status(200).json({ status: true, msg: "Quantity updated" })
    } else {
      await cartSchema.findOneAndRemove(req.body.finddata)
      res.status(200).json({ status: true, msg: "item removed" })

    }
  }
  catch (err) {
    console.log("err", err)
  }
}

export const offersmade = async(req,res)=>{
  try{

  var query = [

    {
        $match: {
            $expr: {
                $and: [{ $ne: ["$status", "cancelled"] },
                { $ne: ["$status", "completed"] },
                { $eq: ["$TokenBidderAddress",req.query.myaddress ] }
                ]
            }
        }
    },
    {
        $lookup: {
            from: "tokenowners",
            "let": {
                "tokenid": "$NFTId",
                "collname":"$CollectionName"
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $ne: ["$NFTBalance", "0"] },
                                { $eq: ["$Status", 'list'] },
                                { $eq: ["$HideShow", "visible"] },
                                { $eq: ["$NFTId", "$$tokenid"] },
                                {
                                    "$eq": [
                                        "$CollectionName",
                                        "$$collname"
                                    ]
                                }
                            ],
                        },
                    }
                },
                { $sort: { createdAt: -1 } },
                { $limit: 1 }
            ],
            as: "nftowners"
        }
    },
    {
        $unwind: {
            path: "$nftowners",
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        $lookup:
        {
            from: "tokens",
            let:{tokid:"$nftowners.NFTId",bidcollname:"$nftowners.CollectionName"},
            pipeline:[
              {$match:{
                  $expr:{
                      $and:[
                      
                         { $eq: ["$NFTId", "$$tokid"] }  ,
                         { $eq: ["$CollectionName", "$$bidcollname"] }  
    
                      ]
                      }
                  }}
            ],
            as: "nftdetails"
        }
    },
    {
        $unwind: {
            path: "$nftdetails",
            preserveNullAndEmptyArrays: true,
        },
    },

    {
        $project: {
            "NFTId": 1,
            "NFTCreator": "$nftdetails.NFTCreator",
            "fileType": "$nftdetails.fileType",
            "NFTName": "$nftdetails.NFTName",
            "NFTOrginalImage": "$nftdetails.NFTOrginalImage",
            "NFTThumpImage":"$nftdetails.NFTThumpImage",
            "CompressedFile": "$nftdetails.NFTOrginalImage",
            "CoinName": 1,
            "TokenBidAmt": 1,
            "status": 1,
            "ContractAddress":1,
            "ContractType":1,
            "Pending":1
        }
    }

]

  var data = await Bids.aggregate([

    {
        $match: {
            $expr: {
                $and: [{ $ne: ["$status", "cancelled"] },
                { $ne: ["$status", "completed"] },
                { $eq: ["$TokenBidderAddress",req.query.myaddress ] }
                ]
            }
        }
    },
    {
        $lookup: {
            from: "tokenowners",
            "let": {
                "tokenid": "$NFTId",
                "collname":"$CollectionName"
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $ne: ["$NFTBalance", "0"] },
                                // { $eq: ["$Status", 'list'] },
                                { $eq: ["$HideShow", "visible"] },
                                { $eq: ["$NFTId", "$$tokenid"] },
                                {
                                    "$eq": [
                                        "$CollectionName",
                                        "$$collname"
                                    ]
                                }
                            ],
                        },
                    }
                },
                { $sort: { createdAt: -1 } },
                { $limit: 1 }
            ],
            as: "nftowners"
        }
    },
    {
        $unwind: {
            path: "$nftowners",
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        $lookup:
        {
            from: "tokens",
            let:{tokid:"$nftowners.NFTId",bidcollname:"$nftowners.CollectionName"},
            pipeline:[
              {$match:{
                  $expr:{
                      $and:[
                      
                         { $eq: ["$NFTId", "$$tokid"] }  ,
                         { $eq: ["$CollectionName", "$$bidcollname"] }  
    
                      ]
                      }
                  }}
            ],
            as: "nftdetails"
        }
    },
    {
        $unwind: {
            path: "$nftdetails",
            preserveNullAndEmptyArrays: true,
        },
    },

    {
        $project: {
            "NFTId": 1,
            "NFTCreator": "$nftdetails.NFTCreator",
            "fileType": "$nftdetails.fileType",
            "NFTName": "$nftdetails.NFTName",
            "NFTOrginalImage": "$nftdetails.NFTOrginalImage",
            "NFTThumpImage":"$nftdetails.NFTThumpImage",
            "CompressedFile": "$nftdetails.NFTOrginalImage",
            "CollectionName": "$nftdetails.CollectionName",
            "CoinName": 1,
            "TokenBidAmt": 1,
            "status": 1,
            "ContractAddress":1,
            "ContractType":1,
            "Pending":1
        }
    }

])
    res.status(200).json({status:true,data:data,msg:"success"})

  }
  catch(err){
    res.status(200).json({status:false,data:[]})
  }
}
 

export const getreceivedbids = async(req,res)=>{
  try{
   var query = JSON.stringify([
    {$match:{NFTOwner:req.query.myaddress}},
    {$lookup:{
        from:"bids",
        let:{tokenid:"$NFTId",collname:"$CollectionName"},
        pipeline:[
          {$match:{
              $expr:{
                  $and:[
                     { $ne: ["$status", "cancelled"] },
                     { $ne: ["$status", "completed"] },
                     { $eq: ["$NFTId", "$$tokenid"] }  ,
                     { $eq: ["$CollectionName", "$$collname"] }  

                  ]
                  }
              }}
        ],
        as:"bidsdata"      
        }},
           {
            $unwind: {
                path: "$bidsdata",
                preserveNullAndEmptyArrays: false,
            },
        },
         {
            $lookup:
            {
                from: "tokens",
                let:{tokid:"$bidsdata.NFTId",bidcollname:"$bidsdata.CollectionName"},
                pipeline:[
                  {$match:{
                      $expr:{
                          $and:[
                          
                             { $eq: ["$NFTId", "$$tokid"] }  ,
                             { $eq: ["$CollectionName", "$$bidcollname"] }  
        
                          ]
                          }
                      }}
                ],
                as: "nftdetails"
            }
        },
        {
            $unwind: {
                path: "$nftdetails",
                preserveNullAndEmptyArrays: true,
            },
        },
         {
            $project: {
                "NFTId": "$bidsdata.NFTId",
                "NFTCreator": "$nftdetails.NFTCreator",
                "fileType": "$nftdetails.fileType",
                "NFTName": "$nftdetails.NFTName",
                "NFTOrginalImage": "$nftdetails.NFTOrginalImage",
                "NFTThumpImage":"$nftdetails.NFTThumpImage",
                "CompressedFile": "$nftdetails.NFTOrginalImage",
                "NFTRoyalty":"$nftdetails.NFTRoyalty",
                "CollectionNetwork":"$nftdetails.CollectionNetwork",
                "CollectionNetwork":"$nftdetails.CollectionNetwork",
                "NFTCreator":"$nftdetails.NFTCreator",
                "Category":"$nftdetails.Category",
                "CoinName": "$bidsdata.CoinName",
                "TokenBidAmt":  "$bidsdata.TokenBidAmt",
                "status": "$bidsdata.status",
                "ContractAddress":"$bidsdata.ContractAddress",
                "ContractType":"$bidsdata.ContractType",
                "Pending":"$bidsdata.Pending",
                "TokenBidderAddress":"$bidsdata.TokenBidderAddress",
                "PutOnSale":1,
                "PutOnSaleType":1,
                "CollectionName":1,
                "EndClockTime":1,
                "isStakeable":1,
                "isStake":1,
                "backedValue":1

            }
        }
    ])
   var data = await TokenOwners.aggregate([
    {$match:{
      NFTOwner:req.query.myaddress,
      NFTBalance:{"$ne":"0"}}},
    {$lookup:{
        from:"bids",
        let:{tokenid:"$NFTId",collname:"$CollectionName"},
        pipeline:[
          {$match:{
              $expr:{
                  $and:[
                     { $ne: ["$status", "cancelled"] },
                     { $ne: ["$status", "completed"] },
                     { $eq: ["$NFTId", "$$tokenid"] }  ,
                     { $eq: ["$CollectionName", "$$collname"] }  

                  ]
                  }
              }}
        ],
        as:"bidsdata"      
        }},
           {
            $unwind: {
                path: "$bidsdata",
                preserveNullAndEmptyArrays: false,
            },
        },
         {
            $lookup:
            {
                from: "tokens",
                let:{tokid:"$bidsdata.NFTId",bidcollname:"$bidsdata.CollectionName"},
                pipeline:[
                  {$match:{
                      $expr:{
                          $and:[
                          
                             { $eq: ["$NFTId", "$$tokid"] }  ,
                             { $eq: ["$CollectionName", "$$bidcollname"] }  
        
                          ]
                          }
                      }}
                ],
                as: "nftdetails"
            }
        },
        {
            $unwind: {
                path: "$nftdetails",
                preserveNullAndEmptyArrays: true,
            },
        },
         {
            $project: {
                "NFTId": "$bidsdata.NFTId",
                "NFTCreator": "$nftdetails.NFTCreator",
                "fileType": "$nftdetails.fileType",
                "NFTName": "$nftdetails.NFTName",
                "NFTOrginalImage": "$nftdetails.NFTOrginalImage",
                "NFTThumpImage":"$nftdetails.NFTThumpImage",
                "CompressedFile": "$nftdetails.NFTOrginalImage",
                "NFTRoyalty":"$nftdetails.NFTRoyalty",
                "CollectionNetwork":"$nftdetails.CollectionNetwork",
                "CollectionNetwork":"$nftdetails.CollectionNetwork",
                "NFTCreator":"$nftdetails.NFTCreator",
                "Category":"$nftdetails.Category",
                "CoinName": "$bidsdata.CoinName",
                "TokenBidAmt":  "$bidsdata.TokenBidAmt",
                "status": "$bidsdata.status",
                "ContractAddress":"$bidsdata.ContractAddress",
                "ContractType":"$bidsdata.ContractType",
                "Pending":"$bidsdata.Pending",
                "TokenBidderAddress":"$bidsdata.TokenBidderAddress",
                "PutOnSale":1,
                "PutOnSaleType":1,
                "CollectionName":1,
                "EndClockTime":1,
                "isStakeable":1,
                "isStake":1,
                "backedValue":1

            }
        }
    ])
   res.status(200).json({status:true,data:data,msg:"successfull"})


   
  }
  catch(err){
    res.status(200).json({status:false,data:[],msg:"failed to get received offers"})
  }
}


export const GetUrlUser = async (req, res) => {
  try {
    var resp = await userSchema.find(req.query)
    if (resp && resp.length > 0) {
      return res.status(200).json({
        status: true, msg: "success", data: {
          WalletAddress: resp[0]?.WalletAddress,
          CustomUrl: resp[0]?.CustomUrl
        }
      })

    } else {
      return res.status(200).json({ status: false, msg: "does not exist" })
    }

  }
  catch (err) {
    res.status(200).json({ status: false, msg: "failed" })
  }
}



export const importedCollectionLoadMore = async (req, res) => {
  const { skip, _id } = req.query
  try {
    var respp = await collectionSchema.findOne(
      { _id: ObjectId(_id) },
      { importednfts: { "$slice": [Number(skip), 10] } }
    )
    if (respp) {
      if (respp.importednfts.length != 0) {
        respp.importednfts.map((val) => {
          if (val.NFTImage == "") testImageAxios(val)
        })
      } else {
        var getDefaulBlock = await collectionSchema.aggregate([
          {
            $match: {
              '_id': ObjectId(_id)
            }
          },
          {
            $project: {
              nftt: { $slice: ["$importednfts", -1] },
              importedNftCount: { $size: '$importednfts' }
            }
          }
        ])
        loadMoreNftContrct(getDefaulBlock)
      }

      return res.json({
        status: "success",
        data: respp
      })
    } else {
      return res.json({
        status: "error1",
        data: []
      })
    }

  } catch (error) {
    console.log("errror on import collection kload", error);
  }
}


export const testImageAxios = async (data) => {
  try {
    const web3 = new Xdc3(config.rpcurl)
    // try {
    var contract = new web3.eth.Contract(SingleAbi, data.contractAddress)
    var imagemeta = await contract.methods.tokenURI(data.NFTId).call()
    var imageurl = await axios.get(imagemeta)
    var polo = await axios.get((imageurl?.data?.animation_url) ? imageurl.data.animation_url : imageurl?.data?.image)

    data.NFTName = imageurl?.data?.name
    data.NFTDescription = imageurl?.data?.description
    data.NFTImage = (imageurl?.data?.animation_url) ? imageurl?.data?.animation_url : imageurl?.data?.image
    data.NFTAnimationUrl = imageurl?.data?.animation_url
    data.fileType = polo.headers["content-type"].split("/")[0]
    var helllo = await collectionSchema.findOneAndUpdate({ "importednfts.NFTId": data.NFTId }, { $set: { "importednfts.$": data } })
  } catch (error) {
    console.log("testImageAxios", error);
  }
}


 
const loadMoreNftContrct = async (data) => {
  try {
    var lastNft = data[0].nftt[0]
    var lastCount = data[0].importedNftCount
    const web3 = new Xdc3(config.rpcurl)

    var contractAddress = lastNft.contractAddress;
    // var latestBlock =  28265401;28292560
    var defaultBlock = lastNft.nftBlock
    // var defaultBlock = 60687643
    var latestBlock = await new web3.eth.getBlockNumber();
    var nftIdCreator = []

    async function getCollectionNfts(startblock) {
      if (startblock <= latestBlock && nftIdCreator.length <=500) {
 
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
        var resp = await NFTUpdateDetails2(nftIdCreator.slice(Number(lastCount), Number(lastCount) + 500))
        if (resp) {
          await collectionSchema.updateOne(
            { "_id": ObjectId(data[0]._id) },  
            {
               "$push": {
                   "importednfts": {
                       "$each": resp
                   }
               }
            }
         )
 
        }
      }
    }

    getCollectionNfts(defaultBlock)

  } catch (error) {
    console.log("error on loadmofe contract", error);
  }
}

 

export const updatewithdrawstatus  = async(req,res)=>{
  try{
   var data = await Tokens.findOneAndUpdate({NFTId:req.body.NFTId,CollectionName:req.body.CollectionName},
   {isWithdrawn:req.body.isWithdrawn},{new:true})

   if(data)
     res.status(200).json({status:true,msg:"success "})
    


  }
  catch(err){
    res.status(200).json({status:false,msg:"failed "})
  }
};
