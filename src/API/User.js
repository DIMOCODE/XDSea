import { createRequest, createSignedRequest } from "./index";
import { HTTP_METHODS } from "../constant";

/**
 * Send an HTTP request to get a specific user's information
 * 
 * @param {string} userId the DB object ID of the user
 * @returns HTTP GET request response with the user object
 */
export const getUser = (userId) => {
  return createRequest(HTTP_METHODS.get, `user/${userId}`, null, null);
};
export const updateUser = (body) => {
  return createSignedRequest(HTTP_METHODS.put, `user`, null, body);
};
export const updateUserSettings = (body) => {
  return createSignedRequest(HTTP_METHODS.put, `user/settings`, null, body);
};
