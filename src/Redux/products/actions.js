import {
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_PENDING,
  GET_PRODUCTS_ERROR,
  GET_PRODUCT_SUCCESS,
  GET_PRODUCT_PENDING,
  GET_PRODUCT_ERROR,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_PENDING,
  DELETE_PRODUCT_ERROR,
  ADD_PRODUCT_SUCCESS,
  ADD_PRODUCT_PENDING,
  ADD_PRODUCT_ERROR,
  EDIT_PRODUCT_SUCCESS,
  EDIT_PRODUCT_PENDING,
  EDIT_PRODUCT_ERROR,
  GET_USER_PRODUCTS_SUCCESS,
  GET_USER_PRODUCTS_PENDING,
  GET_USER_PRODUCTS_ERROR,
} from "./constants";

export const getProductsPending = () => ({
  type: GET_PRODUCTS_PENDING,
});

export const getProductsSuccess = (products) => ({
  type: GET_PRODUCTS_SUCCESS,
  payload: products,
});

export const getProductsError = () => ({
  type: GET_PRODUCTS_ERROR,
});

export const getProductPending = () => ({
  type: GET_PRODUCT_PENDING,
});

export const getProductSuccess = (product) => ({
  type: GET_PRODUCT_SUCCESS,
  payload: product,
});

export const getProductError = () => ({
  type: GET_PRODUCT_ERROR,
});

export const deleteProductPending = () => ({
  type: DELETE_PRODUCT_PENDING,
});

export const deleteProductSuccess = (productId) => ({
  type: DELETE_PRODUCT_SUCCESS,
  payload: productId,
});

export const deleteProductError = () => ({
  type: DELETE_PRODUCT_ERROR,
});

export const addProductPending = () => ({
  type: ADD_PRODUCT_PENDING,
});

export const addProductSuccess = (product) => ({
  type: ADD_PRODUCT_SUCCESS,
  payload: product,
});

export const addProductError = () => ({
  type: ADD_PRODUCT_ERROR,
});

export const editProductPending = () => ({
  type: EDIT_PRODUCT_PENDING,
});

export const editProductSuccess = (product) => ({
  type: EDIT_PRODUCT_SUCCESS,
  payload: product,
});

export const editProductError = () => ({
  type: EDIT_PRODUCT_ERROR,
});

export const getUserProductsPending = () => ({
  type: GET_USER_PRODUCTS_PENDING,
});

export const getUserProductsSuccess = (products) => ({
  type: GET_USER_PRODUCTS_SUCCESS,
  payload: products,
});

export const getUserProductsError = () => ({
  type: GET_USER_PRODUCTS_ERROR,
});
