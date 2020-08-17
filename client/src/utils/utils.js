import { capitalize } from "lodash";

export const calDiscountPercentage = (disAmount, basePrice) =>
  Math.ceil((disAmount / basePrice) * 100);

export const capitalizeStr = str =>
  str && str
      .split(" ")
      .map(word => capitalize(word))
      .join(" ");

export const shorten_the_name = text => {
  const length = 12;
  return text.slice(0, length) + (text.length > length ? "..." : "");
};


export const shorten_the_name_upto_six = (text) => {
  const length = 6;
  return text.slice(0, length) + (text.length > length ? '...' : '');
};

export const capitalize_and_shorten_name = (text) => {
  const length = 6;
  return capitalizeStr(text.slice(0, length) + (text.length > length ? '...' : ''));
};


export const capitalize_and_unsluygify = str =>
  str && str
      .split("_")
      .map(word => capitalize(word))
      .join(" ");

export const comma_separate_numbers = num =>{
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}