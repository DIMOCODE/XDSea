import { createRequest } from "./index"
import { HTTP_METHODS } from "../constant";

export const getUser = (userId) => {
  return createRequest(HTTP_METHODS.get, `user/${userId}`, null, null);
};