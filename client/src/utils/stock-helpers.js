import axios from "axios";
import { base, options } from "./common-helpers";

export const getProductStockQuantity = async (
  productId = 0,
  colorId = 0,
  sizeId = 0
) => {
  const data = JSON.stringify({ productId, colorId, sizeId });
  const url = `${base}/api/cart/getProductStockQuantity`;
  const res = await axios.post(url, data, options);
  return await res.data;
};
