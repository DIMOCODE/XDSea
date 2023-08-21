import Config from "../lib/config";

export const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

export const NumANdDotOnly = (data) => {
  var data = data.toString();
  var str = data
    ? data.includes(".")
      ? data.split(".").length >= 3
        ? (data.split(".")[0] + "." + data.split(".")[1]).toString()
        : data
      : data
    : data;
  return str.toString().replace(Config.NumDigitOnly, "");
};
export const NumberOnly = (data) => {
  return data.toString().replace(Config.NumberOnly, "");
};
