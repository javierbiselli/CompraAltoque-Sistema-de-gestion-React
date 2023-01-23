import { getShopPending, getShopSuccess, getShopError } from "./actions";

export const getShopById = (shopId) => {
  return async (dispatch) => {
    dispatch(getShopPending());
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/shops/${shopId}`,
        {
          headers: {
            "Content-type": "application/json",
            token,
          },
        }
      );
      const res = await response.json();
      dispatch(getShopSuccess(res.data));
      return res;
    } catch (error) {
      dispatch(getShopError(error.toString()));
    }
  };
};
