import axios from "axios";
import { LS, LS_ROOT_KEY } from "../constant";
import { ERROR_CODES, STATUS_CODES } from "../utils/ErrorCatalogue";
const URL_ROOT = process.env.REACT_APP_URL_SERVER;

export const createSignedRequest = async (method, url, params, body) => {
  const data = LS.get(LS_ROOT_KEY);
  if (!data) {
    throw { code: ERROR_CODES.MISSING_TOKEN };
  }
  const bodyRequest = {
    url: `${URL_ROOT}/${url}`,
    method,
    params: params ?? {},
    data: body ?? {},
    headers: {
      Authorization: `Bearer ${data.accessToken}`,
    },
  };
  try {
    return await axios(bodyRequest);
  } catch (error) {
    if (error.response?.status === STATUS_CODES.UNAUTHORIZED) {
      const { refreshToken } = data;
      try {
        const { data: dRes } = await axios({
          url: `${URL_ROOT}/access/refresh`,
          method: "POST",
          params: {},
          data: {},
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });
        LS.set(LS_ROOT_KEY, { ...dRes });
        bodyRequest.headers.Authorization = `Bearer ${dRes.accessToken}`;
        return await axios(bodyRequest);
      } catch (error) {
        if (error.response?.status === STATUS_CODES.UNAUTHORIZED) {
          throw { code: ERROR_CODES.EXPIRED_TOKEN };
        } else {
          throw error;
        }
      }
    }
    throw error;
  }
};
/**
 * This function creates an http request without authentication header
 * @param  {String} method http method, it should be one value of the HTTP_METHODS constant defined in the constant.js file
 * @param  {String} url the request path without domain
 * @param  {Object} params OPTIONAL. Query parameters needed in the request
 * @param  {Object} body OPTIONAL.  Body parameters needed in the request
 * @return {[Promise<Any>]}      Axios Promise Response
 */
export const createRequest = async (
  method,
  url,
  params,
  body,
  customHeaders
) => {
  const bodyRequest = {
    url: `${URL_ROOT}/${url}`,
    method,
    params: params ?? {},
    data: body ?? {},
  };
  if (typeof customHeaders === "object" && Object.keys(customHeaders).length) {
    bodyRequest.headers = customHeaders;
  }
  return await axios(bodyRequest);
};
