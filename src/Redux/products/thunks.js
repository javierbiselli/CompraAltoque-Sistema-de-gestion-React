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
      const token = JSON.parse(sessionStorage.getItem("token"));
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/products`,
        {
          headers: {
            "Content-type": "application/json",
            token,
          },
        }
      );
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
      const token = JSON.parse(sessionStorage.getItem("token"));
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/products/${productId}`,
        {
          headers: {
            "Content-type": "application/json",
            token,
          },
        }
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
      const token = JSON.parse(sessionStorage.getItem("token"));
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            token,
          },
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

export const addProduct = (product, image, shopId, category, subCategory) => {
  return async (dispatch) => {
    dispatch(addProductPending());
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/products`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            token,
          },
          body: JSON.stringify({
            name: product.name,
            price: product.price,
            image: image,
            description: product.description,
            category: category,
            subCategory: subCategory,
            isActive: true,
            hasDiscount: product.hasDiscount,
            discountPercentage: product.discountPercentage,
            discountValidDate: product.discountValidDate,
            stock: product.stock,
            hasPromotion: product.hasPromotion,
            promotionMessage: product.promotionMessage,
            promotionValidDate: product.promotionValidDate,
            shopId: shopId,
            hasStar: false,
            keywords: product.keywords,
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

export const editProduct = (
  product,
  productId,
  image,
  category,
  subCategory
) => {
  return async (dispatch) => {
    dispatch(editProductPending());
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            token,
          },
          body: JSON.stringify({
            name: product.name,
            price: product.price,
            image: image,
            description: product.description,
            category: category,
            subCategory: subCategory,
            isActive: product.isActive,
            hasDiscount: product.hasDiscount,
            discountPercentage: product.discountPercentage,
            discountValidDate: product.discountValidDate,
            stock: product.stock,
            hasPromotion: product.hasPromotion,
            promotionMessage: product.promotionMessage,
            promotionValidDate: product.promotionValidDate,
            hasStar: product.hasStar,
            keywords: product.keywords,
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

export const editAllProductsPrice = (shopId, percent) => {
  return async (dispatch) => {
    dispatch(editProductPending());
    try {
      const productsResponse = await dispatch(getProducts());
      if (productsResponse.error) {
        throw productsResponse.message;
      }
      const updatedProductsPromises = productsResponse.data.map(
        async (product) => {
          if (product.shopId._id === shopId) {
            const newPrice = Math.floor(product.price * percent);
            const token = JSON.parse(sessionStorage.getItem("token"));
            const response = await fetch(
              `${process.env.REACT_APP_API_URL}/products/${product._id}`,
              {
                method: "PUT",
                headers: {
                  "Content-type": "application/json",
                  token,
                },
                body: JSON.stringify({
                  price: newPrice,
                }),
              }
            );
            const res = await response.json();
            if (res.error) {
              throw res.message;
            }
            console.log(`Price of ${product.name} updated to ${newPrice}`);
            console.log(res);
            return res;
          }
        }
      );
      const updatedProductsResponses = await Promise.all(
        updatedProductsPromises
      );
      dispatch(editProductSuccess(updatedProductsResponses));
      return { error: false };
    } catch (error) {
      dispatch(editProductError(error.toString()));
      return {
        error: true,
        message: error,
      };
    }
  };
};
