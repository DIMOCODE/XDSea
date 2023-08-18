const util = require("util");
var exec = util.promisify(require("child_process").exec);
import fs from "fs";
import  create  from 'ipfs-http-client'
// import EmailTemplates from "../app/schema/emailtemplates.schema";
// import nodemailer from "nodemailer";
import qrcode from 'qrcode'
// ipfs
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const { google } = require("googleapis");

// for S3bucket file upload
const AWS = require("aws-sdk")
ffmpeg.setFfmpegPath(ffmpegPath);
import sharp from "sharp";
import Config from "../config/serverConfig";
import { FindOne } from "./mongooseHelper";


export const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0) ||
  (typeof value === "string" && value === "0") ||
  (typeof value === "number" && value === 0);


  export const ImageAddFunc = async (
    send_file,
    type,
    ProfileUrl,
    Id,
    Creator,
    alldata,
    types,names,
    TokenName,
    CollectionNetwork,CollectionUrl
  ) => {
   
    var newSend = await Promise.all(
      send_file.map(async (item) => {
        await fs.mkdir(item.path, { recursive: true }, async function (err) {
          if (err) return false;
          else if (item.filename != "") {
            item.files?.mv(item.path + item.filename, function (err, data) {
              if (err) return false;
              else return item.filename;
            });
          }
        });
        if(types?.toString().includes('airdrop')){
        var promos =await Promise.all([...Array(Number(alldata.Quantity))].map(async(item)=>{
          var code=GenerateCOde(names)
  
          return {
            Code    : code,
            QrCode  :  await QrCode(`${Config.SITE_URL}/info/drop/${CollectionNetwork}/${CollectionUrl}/${Creator}/${Id}/${Buffer.from(code).toString('base64')}`),
            Email   : '',
            Status  : 'generated',
          }
        }))
      }
        return type !== "bulk"
          ? item.filename
          : {
              file: item.filename,
              TokenId: Id,
              Id: Id,
              TokenName: TokenName ? TokenName : Id,
              ProfileUrl: ProfileUrl,
              status: "drop",
              tx: "",
              Description: "",
              ArtistAddress: alldata.ArtistAddress,
              ArtistUrl: alldata.ArtistUrl,
              TokenPrice: alldata.CollectionPrice,
              TokenOwner: Creator,
              Quantity: alldata.Quantity,
              Balance: alldata.Quantity,
              promo : promos ?? [],
              expiry : null
            };
      })
    );
    return newSend.pop();
  };
  
export const compress_file_upload = async (compress_file) => {

  if (compress_file) {
    let newSend = await Promise.all(
      compress_file.map(async (item) => {
        const { data, name, mimetype } = item.files;
        await fs.mkdir(item.path, { recursive: true }, async function () {
          if (String(mimetype).includes("image")) {
            sharp(data, { animated: true })
              .webp({ quality: 80 })
              .toFile(item.path + item.filename)
              .then(() => {
                return true;
              })
              .catch((e) => {
                return false;
              });
               
            return item.filename;
          }
          if (
            String(mimetype).includes("audio") ||
            String(mimetype).includes("video")
          ) {
            var datvi = await ffmpeg(item.fie_path)
              .setStartTime("00:00:01")
              .setDuration(10)
              .output(item.path + item.filename)
              .on("end", function (err,data) {
                if (!err) {
                  return true;
                }
              })
              .on("error", function (err) {
                return false;
              })
              .run();
            return item.filename;
          }
        });
        return item.filename;
      })
    );
    return newSend.pop();
  }
};


 

export const ipfs_add = async (data) => {
  const { item, path } = data;
  var res = false;
  if (!res) {
    var command = `curl -X POST -F file=@${path} -u ${Config.IPFSKEY}:${Config.IPFSPASS} https://ipfs.infura.io:5001/api/v0/add`;
    const { stdout, stderr, error } = await exec(command);
    if (error) {
      return error.toString();
    }
    if (stdout) {
      return JSON.parse(stdout)?.Hash ? JSON.parse(stdout)?.Hash : "";
    }
  } else {
    await ipfs_add({ item, path });
  }
};


// -----> collection profile and banner image upload

export const CollectionImageUpload = async(item)=>{
 
  await fs.mkdir(item.path, { recursive: true }, async function (err) {
    if (err) return false;
    else if (item.filename != "") {
      item.file?.mv(item.path + "/" +item.filename, function (err, data) {
        if (err){
          return false;}
        else return item.filename;
      });
    }
  });

}


export const UploadToBucket = async({path,contenttoupload,contenttype})=>{
  const s3 = new AWS.S3({
    accessKeyId:Config.accesskeyid,
    secretAccessKey:Config.secretkey,
  });

  const params = {
    Bucket:Config.bucketName,
    Key:path,
    Body:contenttoupload,
    ContentType:contenttype,
    ACL: 'public-read'
   }

  try{

  var data = await s3.upload(params).promise()

  if(data) return data.Location
  else return false

   }
  catch(err){
    console.log("upload err",err)
  }

}

export const AddToIpfs  = async(data)=>{
try{

  /**
   * Adding Authentication for pinning new uploads to the IPFS Project
   */
   const auth =
   "Basic " +
   Buffer.from(
     Config.REACT_APP_PROJECT_ID +
       ":" +
       process.env.REACT_APP_PROJECT_SECRET
   ).toString("base64");

 /**
  * Initialize the IPFS HTTP Client
  */
 const client = create({
   url: "https://ipfs.infura.io:5001/api/v0",
   headers: {
     authorization: auth,
   },
 });

 const added = await client.add(data);
 const url = `${Config.ipfsurl}${added.path}`;

 return url

}
catch(err){
  return false
}

}






