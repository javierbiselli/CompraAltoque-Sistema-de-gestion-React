import {
  GET_USER_SUCCESS,
  GET_USER_PENDING,
  GET_USER_ERROR,
} from "./constants";

const initialState = {
  user: {},
  isLoading: false,
  error: false,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_PENDING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isLoading: false,
      };
    case GET_USER_ERROR:
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
