import { getUserPending, getUserSuccess, getUserError } from "./actions";

export const getUserById = (userId) => {
  return async (dispatch) => {
    dispatch(getUserPending());
    try {
      const token = JSON.parse(sessionStorage.getItem('token'));
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/${userId}`,
        {
          headers: {
            "Content-type": "application/json",
            token,
          },
        }
      );
      const res = await response.json();
      dispatch(getUserSuccess(res.data));
      return res;
    } catch (error) {
      dispatch(getUserError(error.toString()));
    }
  };
};
