import { createRequest } from "./index"
import { HTTP_METHODS } from "../constant";

export const getHomeData = () => {
  return createRequest(HTTP_METHODS.get, "spotlightList/home", null, null);
};