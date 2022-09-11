import { createSignedRequest } from "..";
import { HTTP_METHODS } from "../../constant";
import axios from "axios";

export const getUploadImgSignedUrl = (
  contentType,
  ext,
  model,
  key,
  contentId
) => {
  let path = `signedUrlProvider/${model}/`;
  if (contentId) {
    path += `${contentId}/`;
  }
  path += `${key}`;

  return createSignedRequest(HTTP_METHODS.post, path, null, {
    contentType,
    ext,
  });
};

export const loadImgWithPresignedUrl = (file, url) => {
  return axios.put(url, file);
};
