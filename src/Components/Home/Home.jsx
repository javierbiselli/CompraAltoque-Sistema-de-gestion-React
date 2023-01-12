import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./home.module.css";
import { getProducts } from "../../Redux/products/thunks";
import Product from "../Shared/Product/Product";
import { useState } from "react";
import { getUserById } from "../../Redux/user/thunks";

const Home = () => {
  const dispatch = useDispatch();

  const getUser = () => {
    const userUid = JSON.parse(window.sessionStorage.getItem("userUid"));
    try {
      dispatch(getUserById(userUid)).then((res) => {
        if (!res.error) {
          window.sessionStorage.setItem("userData", JSON.stringify(res.data));
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("USEEFFECT EJECUTADO");
    dispatch(getProducts());
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const isLoading = useSelector((state) => state.products.isLoading);
  const listProducts = useSelector((state) => state.products.list);

  const [sort, setSort] = useState("");

  const sortList = () => {
    switch (sort) {
      case "name":
        listProducts.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        break;
      case "category":
        listProducts.sort((a, b) => {
          if (a.category < b.category) {
            return -1;
          }
          if (a.category > b.category) {
            return 1;
          }
          return 0;
        });
        break;
      case "isActive":
        listProducts.sort((a, b) => {
          if (a.isActive > b.isActive) {
            return -1;
          }
          if (a.isActive < b.isActive) {
            return 1;
          }
          return 0;
        });
        break;
      case "isInactive":
        listProducts.sort((a, b) => {
          if (a.isActive < b.isActive) {
            return -1;
          }
          if (a.isActive > b.isActive) {
            return 1;
          }
          return 0;
        });
        break;
      case "price":
        listProducts.sort((a, b) => {
          if (a.price < b.price) {
            return -1;
          }
          if (a.price > b.price) {
            return 1;
          }
          return 0;
        });
        break;
      case "priceHigh":
        listProducts.sort((a, b) => {
          if (a.price > b.price) {
            return -1;
          }
          if (a.price < b.price) {
            return 1;
          }
          return 0;
        });
        break;
      case "hasNotDiscount":
        listProducts.sort((a, b) => {
          if (a.hasDiscount < b.hasDiscount) {
            return -1;
          }
          if (a.hasDiscount > b.hasDiscount) {
            return 1;
          }
          return 0;
        });
        break;
      case "hasDiscount":
        listProducts.sort((a, b) => {
          if (a.hasDiscount > b.hasDiscount) {
            return -1;
          }
          if (a.hasDiscount < b.hasDiscount) {
            return 1;
          }
          return 0;
        });
        break;
      default:
        break;
    }
  };

  if (sort) {
    sortList();
  }

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [click, setClick] = useState(false);

  const handleSearchBar = () => {
    setClick(true);
    if (search.length > 1) {
      filterProducts(search);
    }
  };

  const filterProducts = (value) => {
    // eslint-disable-next-line array-callback-return
    const searchResult = listProducts.filter((product) => {
      if (
        product.name
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()) ||
        product.description
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()) ||
        product.category
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase())
      ) {
        return product;
      }
    });
    setProducts(searchResult);
  };

  return (
    <div className={styles.homeContainer}>
      {isLoading ? (
        <p>cargando...</p>
      ) : (
        <>
          <div className={styles.searchBarContainer}>
            <div className={styles.searchInputButtonsContainer}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar producto"
              />
              <button onClick={handleSearchBar} className={styles.searchButton}>
                Buscar
              </button>
              <button
                className={styles.searchButton}
                onClick={() => {
                  products && setProducts([]);
                  setSearch("");
                  setClick(false);
                }}
              >
                X
              </button>
            </div>
            <div className={styles.searchResultContainer}>
              {products.length < 1 && click ? (
                <p>No se encontro ningun producto</p>
              ) : (
                products.map((product) => (
                  <Product
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    image={product.image}
                    price={product.price}
                    description={product.description}
                    category={product.category}
                    hasDiscount={product.hasDiscount}
                    discountPercentage={product.discountPercentage}
                    discountValidDate={product.discountValidDate}
                    isActive={product.isActive}
                    stock={product.stock}
                    hasPromotion={product.hasPromotion}
                    promotionMessage={product.promotionMessage}
                    promotionValidDate={product.promotionValidDate}
                  />
                ))
              )}
            </div>
          </div>
          <div className={styles.mainContainer}>
            <h3 className={styles.homeContainerH3}>Productos</h3>
            <div className={styles.orderBySelect}>
              <p>Ordenar por:</p>
              <select
                onChange={(e) => {
                  const key = e.target.value;
                  setSort(key);
                }}
                defaultValue="none"
              >
                <option value="none" disabled>
                  Seleccione
                </option>
                <option value="name">Nombre</option>
                <option value="price">Precio mas bajo</option>
                <option value="priceHigh">Precio mas alto</option>
                <option value="category">Categoria</option>
                <option value="hasDiscount">Con descuento</option>
                <option value="hasNotDiscount">Sin descuento</option>
                <option value="isActive">Activos</option>
                <option value="isInactive">Inactivos</option>
              </select>
            </div>
          </div>
          {listProducts.map((products) => (
            <Product
              key={products._id}
              id={products._id}
              name={products.name}
              image={products.image}
              price={products.price}
              description={products.description}
              category={products.category}
              hasDiscount={products.hasDiscount}
              discountPercentage={products.discountPercentage}
              discountValidDate={products.discountValidDate}
              isActive={products.isActive}
              stock={products.stock}
              hasPromotion={products.hasPromotion}
              promotionMessage={products.promotionMessage}
              promotionValidDate={products.promotionValidDate}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Home;