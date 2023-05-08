/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./home.module.css";
import { getProducts, editAllProductsPrice } from "../../Redux/products/thunks";
import Product from "../Shared/Product/Product";
import { tokenListener } from "../../firebase";
import { getAuth } from "../../Redux/auth/thunks";
import Modal from "../Shared/Modal/Modal";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useForm } from "react-hook-form";
import Input from "../Shared/Input/Input";
import Table from "../Shared/Table/Table";
import Loader from "../Shared/Loader/Loader";

const Home = () => {
  const dispatch = useDispatch();

  const token = useSelector((store) => store.auth.authenticated?.token);

  useEffect(() => {
    tokenListener();
    console.log("token");
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(getAuth(token));
    }
  }, [token]);

  useEffect(() => {
    console.log("USEEFFECT producto EJECUTADO");
    dispatch(getProducts());
  }, [dispatch]);

  const userData = JSON.parse(window.sessionStorage.getItem("userData"));
  const isLoading = useSelector((state) => state.products.isLoading);
  const oldListProducts = useSelector((state) => state.products.list);

  const listProducts = oldListProducts.filter(
    (product) => product.shopId._id === userData.shopId
  );

  const editPercentSchema = Joi.object({
    percent: Joi.number().min(1).max(100).messages({
      "number.min": "Minimo: 1",
      "number.max": "Maximo: 100",
      "number.base": "Este campo es obligatorio",
    }),
    hasDiscount: Joi.boolean(),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: joiResolver(editPercentSchema),
  });

  const calculateDiscount = (discountPercentage, originalPrice) => {
    const discount = discountPercentage;
    const price = originalPrice;
    return Math.round(price - (discount / 100) * price);
  };

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
      case "highStock":
        listProducts.sort((a, b) => {
          if (a.stock > b.stock) {
            return -1;
          }
          if (a.stock < b.stock) {
            return 1;
          }
          return 0;
        });
        break;
      case "lowStock":
        listProducts.sort((a, b) => {
          if (a.stock < b.stock) {
            return -1;
          }
          if (a.stock > b.stock) {
            return 1;
          }
          return 0;
        });
        break;
      case "hasStar":
        listProducts.sort((a, b) => {
          if (a.hasStar > b.hasStar) {
            return -1;
          }
          if (a.hasStar < b.hasStar) {
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
          const priceAWithDiscount = calculateDiscount(
            a.hasDiscount ? a.discountPercentage : 0,
            a.price
          );

          const priceBWithDiscount = calculateDiscount(
            b.discountPercentage ? b.discountPercentage : 0,
            b.price
          );

          if (priceAWithDiscount < priceBWithDiscount) {
            return -1;
          }
          if (priceAWithDiscount > priceBWithDiscount) {
            return 1;
          }
        });
        break;
      case "priceHigh":
        listProducts.sort((a, b) => {
          const priceAWithDiscount = calculateDiscount(
            a.hasDiscount ? a.discountPercentage : 0,
            a.price
          );

          const priceBWithDiscount = calculateDiscount(
            b.discountPercentage ? b.discountPercentage : 0,
            b.price
          );

          if (priceAWithDiscount > priceBWithDiscount) {
            return -1;
          }
          if (priceAWithDiscount < priceBWithDiscount) {
            return 1;
          }
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

  const [openModal, setOpenModal] = useState(false);
  const [children, setChildren] = useState("");
  const [percent, setPercent] = useState(0);

  const [tableView, setTableView] = useState(false);

  const handleSearchBar = () => {
    setClick(true);
    if (search.length > 1) {
      filterProducts(search);
    }
  };

  const filterProducts = (values) => {
    const searchWords = values.toLowerCase().split(" ");
    const searchResult = listProducts.filter((product) => {
      let match = 0;
      searchWords.forEach((word) => {
        if (
          product.keywords.join(" ").match(word)
        ) {
          match += 1;
        }
      });
      if (match === searchWords.length) {
        return product;
      }
    });
    setProducts(searchResult);
  };

  const editAllPrices = () => {
    const confirmMessage = `¿Vas a aplicar un aumento del ${percent}% en todos tus productos (${listProducts.length}), estas seguro?`;
    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;
    try {
      dispatch(editAllProductsPrice(userData.shopId, percent / 100 + 1)).then(
        (response) => {
          if (!response.error) {
            setOpenModal(false);
            setTableView(false);
            alert("Productos editados");
            dispatch(getProducts());
          } else {
            alert(`Ocurrio un error "${response.message}"`);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.homeContainer}>
      {isLoading && !tableView ? (
        <Loader show={isLoading} />
      ) : (
        <>
          <div className={styles.searchBarContainer}>
            <div className={styles.searchInputButtonsContainer}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    filterProducts(search);
                  }
                }}
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
                <div style={{ textAlign: "center" }}>
                  <p>No se encontro ningun producto</p>
                </div>
              ) : (
                products.map((product, index) => (
                  <Product productData={product} key={index} />
                ))
              )}
            </div>
          </div>
          <div className={styles.mainContainer}>
            <h3 className={styles.homeContainerH3}>Productos</h3>
            <div className={styles.orderBySelect}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontWeight: "bold" }}>Ordenar por:</p>
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
                  <option value="highStock">Mayor stock</option>
                  <option value="lowStock">Menor stock</option>
                  <option value="hasStar">Destacados</option>
                  <option value="price">Precio mas bajo</option>
                  <option value="priceHigh">Precio mas alto</option>
                  <option value="category">Categoria</option>
                  <option value="hasDiscount">Con descuento</option>
                  <option value="hasNotDiscount">Sin descuento</option>
                  <option value="isActive">Activos</option>
                  <option value="isInactive">Inactivos</option>
                </select>
              </div>
              <button
                className={styles.editPriceButton}
                onClick={() => setOpenModal(true)}
              >
                Aumentar precios
              </button>
            </div>
            <div className={styles.tableButtonContainer}>
              <button
                onClick={() => setTableView(!tableView)}
                className={styles.searchButton}
              >
                {tableView ? "Vista individual" : "Vista de tabla"}
              </button>
            </div>
          </div>
          {tableView ? (
            <Table
              listProducts={listProducts}
              openModal={openModal}
              setOpenModal={setOpenModal}
              children={children}
              setChildren={setChildren}
              calculateDiscount={calculateDiscount}
            />
          ) : (
            <div className={styles.listProductsContainer}>
              {listProducts.length === 0
                ? 'No hay productos, podes agregar haciendo click en "Agregar productos"'
                : listProducts.map((products, index) => (
                    <Product productData={products} key={index} />
                  ))}
            </div>
          )}
        </>
      )}
      <Modal
        isOpen={openModal}
        closeButton={"Cerrar"}
        handleClose={() => setOpenModal(false)}
      >
        {children ? (
          children
        ) : (
          <div className={styles.priceModal}>
            <h3>Aumento general de precios</h3>
            Quiero aumentar el precio de todos mis productos en {percent}%:
            <div>
              <form>
                <Input
                  type={"number"}
                  name={"percent"}
                  placeholder={"Porcentaje"}
                  register={register}
                  error={errors.percent?.message}
                  {...register("percent", {
                    onChange: (e) => {
                      setPercent(e.target.value);
                    },
                  })}
                />
              </form>
            </div>
            <button onClick={handleSubmit(editAllPrices)}>Aumentar</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Home;
