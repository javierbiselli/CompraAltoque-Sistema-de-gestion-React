import { getUserPending, getUserSuccess, getUserError } from "./actions";

export const getUserById = (userId) => {
  return async (dispatch) => {
    dispatch(getUserPending());
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/${userId}`
      );
      const res = await response.json();
      dispatch(getUserSuccess(res.data));
      return res;
    } catch (error) {
      dispatch(getUserError(error.toString()));
    }
  };
};
