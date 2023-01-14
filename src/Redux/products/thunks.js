import {
  getProductsPending,
  getProductsSuccess,
  getProductsError,
  deleteProductPending,
  deleteProductSuccess,
  deleteProductError,
  addProductPending,
  addProductSuccess,
  addProductError,
  editProductPending,
  editProductSuccess,
  editProductError,
  getProductPending,
  getProductSuccess,
  getProductError,
} from "./actions";

export const getProducts = () => {
  return async (dispatch) => {
    dispatch(getProductsPending());
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products`);
      const res = await response.json();
      dispatch(getProductsSuccess(res.data));
      return res;
    } catch (error) {
      dispatch(getProductsError(error.toString()));
    }
  };
};

export const getProductById = (productId) => {
  return async (dispatch) => {
    dispatch(getProductPending());
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/products/${productId}`
      );
      const res = await response.json();
      dispatch(getProductSuccess(res.data));
      return res;
    } catch (error) {
      dispatch(getProductError(error.toString()));
    }
  };
};

export const deleteProduct = (productId) => {
  return async (dispatch) => {
    dispatch(deleteProductPending());
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/products/${productId}`,
        {
          method: "DELETE",
        }
      );
      const res = await response.json();
      if (res.error) {
        throw res.message;
      }
      dispatch(deleteProductSuccess(productId));
      return res;
    } catch (error) {
      dispatch(deleteProductError(error.toString()));
    }
  };
};

export const addProduct = (product, image, userId, category) => {
  return async (dispatch) => {
    dispatch(addProductPending());
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/products`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            name: product.name,
            price: product.price,
            image: image,
            description: product.description,
            category: category,
            isActive: true,
            hasDiscount: product.hasDiscount,
            discountPercentage: product.discountPercentage,
            discountValidDate: product.discountValidDate,
            stock: product.stock,
            hasPromotion: product.hasPromotion,
            promotionMessage: product.promotionMessage,
            promotionValidDate: product.promotionValidDate,
            owner: userId,
            hasStar: false,
          }),
        }
      );
      const res = await response.json();
      if (res.error) {
        throw res.message;
      }
      dispatch(addProductSuccess(res.data));
      return res;
    } catch (error) {
      dispatch(addProductError(error.toString()));
      return {
        error: true,
        message: error,
      };
    }
  };
};

export const editProduct = (product, productId, image, category) => {
  return async (dispatch) => {
    dispatch(editProductPending());
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            name: product.name,
            price: product.price,
            image: image,
            description: product.description,
            category: category,
            isActive: product.isActive,
            hasDiscount: product.hasDiscount,
            discountPercentage: product.discountPercentage,
            discountValidDate: product.discountValidDate,
            stock: product.stock,
            hasPromotion: product.hasPromotion,
            promotionMessage: product.promotionMessage,
            promotionValidDate: product.promotionValidDate,
            hasStar: product.hasStar,
          }),
        }
      );
      const res = await response.json();
      if (res.error) {
        throw res.message;
      }
      dispatch(editProductSuccess(res.data));
      return res;
    } catch (error) {
      dispatch(editProductError(error.toString()));
      return {
        error: true,
        message: error,
      };
    }
  };
};
