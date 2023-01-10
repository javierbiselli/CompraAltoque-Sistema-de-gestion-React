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
} from "./constants";

const initialState = {
  list: [],
  product: {},
  isLoading: false,
  error: false,
};

export const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCTS_PENDING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        list: action.payload,
        isLoading: false,
      };
    case GET_PRODUCTS_ERROR:
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    case GET_PRODUCT_PENDING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_PRODUCT_SUCCESS:
      return {
        ...state,
        product: action.payload,
        isLoading: false,
      };
    case GET_PRODUCT_ERROR:
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    case DELETE_PRODUCT_PENDING:
      return {
        ...state,
        isLoading: true,
      };
    case DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        list: state.list.filter((a) => a._id !== action.payload),
        isLoading: false,
      };
    case DELETE_PRODUCT_ERROR:
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    case ADD_PRODUCT_PENDING:
      return {
        ...state,
        isLoading: true,
      };
    case ADD_PRODUCT_SUCCESS:
      return {
        ...state,
        list: [...state.list, action.payload],
        isLoading: false,
      };
    case ADD_PRODUCT_ERROR:
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    case EDIT_PRODUCT_PENDING:
      return {
        ...state,
        isLoading: true,
      };
    case EDIT_PRODUCT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        list: state.list.map((a) => {
          if (a._id === action.payload._id) {
            return action.payload;
          }
          return a;
        }),
      };
    case EDIT_PRODUCT_ERROR:
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
