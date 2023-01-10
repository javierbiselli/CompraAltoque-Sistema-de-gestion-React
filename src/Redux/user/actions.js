import {
  GET_USER_SUCCESS,
  GET_USER_PENDING,
  GET_USER_ERROR,
} from "./constants";

export const getUserPending = () => ({
  type: GET_USER_PENDING,
});

export const getUserSuccess = (user) => ({
  type: GET_USER_SUCCESS,
  payload: user,
});

export const getUserError = () => ({
  type: GET_USER_ERROR,
});
