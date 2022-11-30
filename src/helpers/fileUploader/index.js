import { updateCollection } from "../../API/Collection";
import { updateNFT } from "../../API/NFT";
import {
  getUploadImgSignedUrl,
  loadImgWithPresignedUrl,
} from "../../API/S3Bucket";
import { updateUser } from "../../API/User";

export const uploadFileInS3Bucket = async (
  file,
  model,
  key,
  idContent = null
) => {
  try {
    let ext = file.type.split("/");
    ext = ext[ext.length - 1];
    const { data: respSignedUrl } = await getUploadImgSignedUrl(
      file.type,
      ext,
      model,
      key,
      idContent
    );
    const { signedUrl, url } = respSignedUrl || {};
    if (!signedUrl) {
      throw "no signedUrl";
    }
    try {
      await loadImgWithPresignedUrl(file, signedUrl);
    } catch (error) {
      console.log("Error on uploading file in signed request");
      return false;
    }
    try {
      let resp;
      if (model === "nft") {
        const body = { [key]: { s3: url } };
        resp = await updateNFT(idContent, body);
      } else if (model === "collection") {
        const body = { [key]: url };
        resp = await updateCollection(idContent, body);
      } else if (model === "user") {
        const body = { [key]: url };
        resp = await updateUser(body);
      }
      return true;
    } catch (error) {
      console.log("Error on updating the model");
      return false;
    }
  } catch (error) {
    console.log("Error on getting signed request");
    return false;
  }
};
