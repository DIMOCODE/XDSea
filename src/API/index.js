import axios from "axios";
import { LS, LS_ROOT_KEY } from "../constant";
import { ERROR_CODES, STATUS_CODES } from "../utils/ErrorCatalogue";
const URL_ROOT = process.env.REACT_APP_URL_SERVER;

const createRequest = async (method, url, params, body) => {
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
