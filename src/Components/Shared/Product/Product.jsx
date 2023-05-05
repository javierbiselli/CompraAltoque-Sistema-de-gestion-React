import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { deleteProduct, editProduct } from "../../../Redux/products/thunks";
import Input from "../Input/Input";
import Modal from "../Modal/Modal";
import styles from "./product.module.css";
import { Link } from "react-router-dom";
import noImage from "../../../Resources/Images/productoSinImagen.png";
import { MdEdit, MdDelete } from "react-icons/md";
import { BiStar } from "react-icons/bi";
import ModalProduct from "../ModalProduct/ModalProduct";

const Product = ({ productData }) => {
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);
  const [children, setChildren] = useState("");

  const [productId, setProductId] = useState();
  const [deleteState, setDeleteState] = useState(false);
  const [deactivationState, setDeactivationState] = useState(false);
  const [discountState, setDiscountState] = useState(false);
  const [starState, setStarState] = useState(false);

  const { handleSubmit, register } = useForm({
    mode: "onChange",
    defaultValues: {
      name: productData.name,
      price: productData.price,
      image: productData.image,
      description: productData.description,
      category: productData.category,
      subCategory: productData.subCategory,
      stock: productData.stock,
      isActive: productData.isActive,
      hasDiscount: productData.hasDiscount,
      discountPercentage: productData.discountPercentage,
      discountValidDate: productData.discountValidDate,
    },
  });

  const isDateValid = () => {
    const now = (date) =>
      new Date(date.getTime() + new Date().getTimezoneOffset() * -60 * 1000)
        .toISOString()
        .slice(0, 19);

    if (
      productData.discountValidDate &&
      productData.discountValidDate < now(new Date()) &&
      productData.hasDiscount &&
      productData.isActive
    ) {
      const data = { hasDiscount: false, discountValidDate: null };
      console.log(`${productData.name} descuento eliminado`);
      dispatch(editProduct(data, productData.id)).then((response) => {
        if (!response.error) {
          alert(
            `Se desactivo el descuento de %${productData.discountPercentage} en ${productData.name} porque dejo de tener validez (valido hasta ${productData.discountValidDate})`
          );
        } else {
          alert(`Ocurrio un error "${response.message}"`);
        }
      });
    }
  };

  useEffect(() => {
    console.log("VALIDEZ DE FECHA EJECUTADO");
    isDateValid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateDiscount = () => {
    const discount = productData.discountPercentage;
    const price = productData.price;
    return Math.round(price - (discount / 100) * price);
  };

  const handleProductDelete = () => {
    if (
      window.confirm(
        "Estas seguro de que queres borrar este producto? (si lo borras deja de aparecer en la lista y ya no estara disponible para los clientes)"
      )
    ) {
      try {
        dispatch(deleteProduct(productId)).then((response) => {
          if (!response.error) {
            alert("Producto borrado correctamente");
            setProductId(null);
          } else {
            alert(`Ocurrio un error "${response.message}"`);
          }
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      setProductId(null);
    }
  };

  const handleProductDeactivation = () => {
    const data = { isActive: !productData.isActive };
    if (
      window.confirm(
        `Estas seguro que queres ${
          productData.isActive
            ? "desactivar este producto? (si desactivas el producto, dejara de estar disponible para los clientes, lo podes volver a activar en cualquier momento)"
            : "activar este producto?"
        }`
      )
    ) {
      try {
        dispatch(editProduct(data, productId)).then((response) => {
          if (!response.error) {
            alert(
              `Producto ${
                productData.isActive ? "desactivado" : "activado"
              } correctamente`
            );
            setProductId(null);
          } else {
            alert(`Ocurrio un error "${response.message}"`);
          }
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      setProductId(null);
    }
  };

  const handleProductDiscount = (data) => {
    try {
      dispatch(editProduct(data, productId)).then((response) => {
        if (!response.error) {
          alert(
            `Descuento ${
              productData.hasDiscount ? "modificado" : "agregado"
            } correctamente`
          );
          setProductId(null);
        } else {
          alert(`Ocurrio un error "${response.message}"`);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalDiscount = () => {
    setOpenModal(true);
    setChildren(
      <section className={styles.discountModalContainer}>
        <h4>
          {productData.hasDiscount
            ? "Modificar descuento"
            : "Agregar descuento"}
        </h4>
        <p style={{ fontSize: "0.9rem", margin: "10px 0" }}>
          Al activar el descuento se le enviara una notificacion a los clientes
          que tengan instalada la aplicacion
        </p>
        <h4>{productData.name}</h4>
        <form
          onSubmit={handleSubmit(handleProductDiscount)}
          key={productData.id}
        >
          <div className={styles.hasDicountModalContainer}>
            <label htmlFor="hasDiscount">Descuento:</label>
            <Input type={"checkbox"} name={"hasDiscount"} register={register} />
          </div>
          <Input
            type={"number"}
            name={"discountPercentage"}
            placeholder={"Porcentage de descuento"}
            register={register}
            min="0"
            max="100"
          />
          <p>Valido hasta:</p>
          <Input
            type={"datetime-local"}
            name={"discountValidDate"}
            register={register}
          />
          <input
            type="submit"
            value="Continuar"
            className={styles.discountButtonModal}
          />
        </form>
      </section>
    );
  };

  const handleStar = () => {
    const data = { hasStar: !productData.hasStar };
    if (
      window.confirm(
        `Estas seguro que queres ${
          productData.hasStar
            ? "eliminar este producto de destacados?"
            : "agregar este producto a destacados? (si lo agregas a destacados, aparecera primero en la lista de productos cuando el cliente entre en la app)"
        }`
      )
    ) {
      try {
        dispatch(editProduct(data, productId)).then((response) => {
          if (!response.error) {
            alert(
              `Producto ${
                productData.hasStar ? "eliminado de destacados" : "destacado"
              } correctamente`
            );
            setProductId(null);
          } else {
            alert(`Ocurrio un error "${response.message}"`);
          }
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      setProductId(null);
    }
  };

  if (deleteState) {
    handleProductDelete();
    setDeleteState(false);
  }

  if (deactivationState) {
    handleProductDeactivation();
    setDeactivationState(false);
  }

  if (discountState) {
    handleModalDiscount();
    setDiscountState(false);
  }

  if (starState) {
    handleStar();
    setStarState(false);
  }

  return (
    <>
      <section
        className={
          productData.hasStar
            ? styles.productContainerStar
            : styles.productContainer
        }
      >
        <div className={styles.productContainerHeader}>
          <div className={styles.starContainer}>
            <button
              className={styles.starButton}
              onClick={() => {
                setProductId(productData._id);
                setStarState(true);
              }}
            >
              <BiStar
                title="Destacar producto"
                style={{ fontSize: "1.5rem" }}
              />
            </button>
            {productData.hasStar && productData.isActive && (
              <span
                style={{
                  color: "green",
                  fontWeight: "bolder",
                  fontSize: "1rem",
                }}
              >
                Producto destacado
              </span>
            )}
            {!productData.isActive && (
              <p
                style={{ color: "#444", fontStyle: "italic", fontSize: "1rem" }}
              >
                Producto inactivo
              </p>
            )}
          </div>
          <div className={styles.actionsContainer}>
            <Link
              to={`/edit/${productData._id}`}
              className={styles.editButton}
              onClick={() => {
                setProductId(productData._id);
                window.sessionStorage.setItem(
                  "productData",
                  JSON.stringify(productData)
                );
              }}
            >
              <MdEdit title="Editar producto" />
            </Link>
            <button
              className={styles.deleteButton}
              onClick={() => {
                setProductId(productData._id);
                setDeleteState(true);
              }}
            >
              <MdDelete title="Borrar producto" />
            </button>
          </div>
        </div>
        <div
          className={
            productData.isActive === false ? styles.inactiveProduct : ""
          }
        ></div>
        <div className={styles.productInnerContainer}>
          <div
            className={styles.imgContainer}
            onClick={() => {
              setOpenModal(true);
              setChildren(
                <ModalProduct
                  productData={productData}
                  calculateDiscount={calculateDiscount}
                  setProductId={setProductId}
                  setDiscountState={setDiscountState}
                  setDeactivationState={setDeactivationState}
                  setDeleteState={setDeleteState}
                />
              );
            }}
          >
            {productData.image ? (
              <img
                className={styles.img}
                src={productData.image}
                alt={productData.name}
              />
            ) : (
              <img
                className={styles.noImg}
                src={noImage}
                alt={"Producto sin imagen"}
              ></img>
            )}
          </div>
          <div className={styles.productDataContainer}>
            <h3
              onClick={() => {
                setOpenModal(true);
                setChildren(
                  <ModalProduct
                    productData={productData}
                    calculateDiscount={calculateDiscount}
                    setProductId={setProductId}
                    setDiscountState={setDiscountState}
                    setDeactivationState={setDeactivationState}
                    setDeleteState={setDeleteState}
                  />
                );
              }}
            >
              {productData.name}
            </h3>
            <h4
              onClick={() => {
                setOpenModal(true);
                setChildren(
                  <ModalProduct
                    productData={productData}
                    calculateDiscount={calculateDiscount}
                    setProductId={setProductId}
                    setDiscountState={setDiscountState}
                    setDeactivationState={setDeactivationState}
                    setDeleteState={setDeleteState}
                  />
                );
              }}
            >
              {productData.hasDiscount ? (
                <>
                  <p>${calculateDiscount()}</p>
                  <p className={styles.priceDiscount}>${productData.price}</p>
                </>
              ) : (
                <p>${productData.price}</p>
              )}
            </h4>
            <div className={styles.productButtonContainer}>
              <button
                className={styles.discountButton}
                onClick={() => {
                  setProductId(productData._id);
                  setDiscountState(true);
                }}
              >
                {productData.hasDiscount
                  ? "Modificar descuento"
                  : "Agregar descuento"}
              </button>
              <button
                className={styles.deactivateButton}
                onClick={() => {
                  setProductId(productData._id);
                  setDeactivationState(true);
                }}
              >
                {productData.isActive
                  ? "Desactivar producto"
                  : "Activar Producto"}
              </button>
            </div>
          </div>
        </div>
      </section>
      <Modal
        isOpen={openModal}
        closeButton={"Cerrar"}
        handleClose={() => setOpenModal(false)}
      >
        {children}
      </Modal>
    </>
  );
};

export default Product;
