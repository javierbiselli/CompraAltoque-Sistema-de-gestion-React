import {
  GET_SHOP_PENDING,
  GET_SHOP_SUCCESS,
  GET_SHOP_ERROR,
} from "./constants";

export const getShopPending = () => ({
  type: GET_SHOP_PENDING,
});

export const getShopSuccess = (shop) => ({
  type: GET_SHOP_SUCCESS,
  payload: shop,
});

export const getShopError = () => ({
  type: GET_SHOP_ERROR,
});
