import { createRequest } from "./index"
import { HTTP_METHODS } from "../constant";

/**
 * Send an HTTP request to get the data for all the content on the Home page
 * 
 * @returns HTTP GET request response with a list of featured NFTs, a list of top collections, and a list of trending NFTs
 */
export const getHomeData = () => {
  return createRequest(HTTP_METHODS.get, "spotlightList/home", null, null);
};