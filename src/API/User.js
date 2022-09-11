import { createRequest, createSignedRequest } from "./index";
import { HTTP_METHODS } from "../constant";

export const getUser = (userId) => {
  return createRequest(HTTP_METHODS.get, `user/${userId}`, null, null);
};
export const updateUser = (body) => {
  return createSignedRequest(HTTP_METHODS.put, `user`, null, body);
};
