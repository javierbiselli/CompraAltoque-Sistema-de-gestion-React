import {
  GET_SHOP_PENDING,
  GET_SHOP_SUCCESS,
  GET_SHOP_ERROR,
} from "./constants";

const initialState = {
  shop: {},
  isLoading: false,
  error: false,
};

export const shopsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SHOP_PENDING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_SHOP_SUCCESS:
      return {
        ...state,
        shop: action.payload,
        isLoading: false,
      };
    case GET_SHOP_ERROR:
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    default: {
      return state;
    }
  }
};
