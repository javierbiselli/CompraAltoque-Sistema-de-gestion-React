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

const Product = (props) => {
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
      name: props.name,
      price: props.price,
      image: props.image,
      description: props.description,
      category: props.category,
      isActive: props.isActive,
      hasDiscount: props.hasDiscount,
      discountPercentage: props.discountPercentage,
      discountValidDate: props.discountValidDate,
    },
  });

  const isDateValid = () => {
    const now = (date) =>
      new Date(date.getTime() + new Date().getTimezoneOffset() * -60 * 1000)
        .toISOString()
        .slice(0, 19);

    if (
      props.discountValidDate &&
      props.discountValidDate < now(new Date()) &&
      props.hasDiscount &&
      props.isActive
    ) {
      const data = { hasDiscount: false, discountValidDate: null };
      console.log(`${props.name} descuento eliminado`);
      dispatch(editProduct(data, props.id)).then((response) => {
        if (!response.error) {
          alert(
            `Se desactivo el descuento de %${props.discountPercentage} en ${props.name} porque dejo de tener validez (valido hasta ${props.discountValidDate})`
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
    const discount = props.discountPercentage;
    const price = props.price;
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
    const data = { isActive: !props.isActive };
    if (
      window.confirm(
        `Estas seguro que queres ${
          props.isActive
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
                props.isActive ? "desactivado" : "activado"
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
              props.hasDiscount ? "modificado" : "agregado"
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
          {props.hasDiscount ? "Modificar descuento" : "Agregar descuento"}
        </h4>
        <p style={{ fontSize: "0.9rem", margin: "10px 0" }}>
          Al activar el descuento se le enviara una notificacion a los clientes
          que tengan instalada la aplicacion
        </p>
        <h4>{props.name}</h4>
        <form onSubmit={handleSubmit(handleProductDiscount)} key={props.id}>
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
    const data = { hasStar: !props.hasStar };
    if (
      window.confirm(
        `Estas seguro que queres ${
          props.hasStar
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
                props.hasStar ? "eliminado de destacados" : "destacado"
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

  const setModalContent = () => {
    setChildren(
      <section className={styles.modalProductContainer}>
        <Link
          to={`/edit/${props.id}`}
          className={styles.editButtonModal}
          onClick={() => {
            setProductId(props.id);
            window.sessionStorage.setItem("productData", JSON.stringify(props));
          }}
        >
          Editar producto
        </Link>
        <div
          className={props.isActive === false ? styles.inactiveProduct : ""}
        ></div>
        <div className={styles.productInnerContainer}>
          <div
            className={styles.imgContainer}
            onClick={() => setOpenModal(true)}
          >
            {props.image ? (
              <img
                className={styles.imgModal}
                src={props.image}
                alt={props.alt}
              />
            ) : (
              <img className={styles.noImg} src={noImage} alt={props.alt}></img>
            )}
          </div>
          <div className={styles.productDataContainer}>
            <h3>{props.name}</h3>
            <h4>Categoria: {props.category}</h4>
            <h4>
              Descuento:{" "}
              {props.hasDiscount ? "%" + props.discountPercentage : "no"}
            </h4>
            {props.hasDiscount ? (
              <>
                <p className={styles.priceDiscount}>${props.price}</p>
                <p>${calculateDiscount()}</p>
                <p>
                  descuento valido hasta:{" "}
                  {props.discountValidDate
                    ? props.discountValidDate
                    : "indeterminado"}
                </p>
              </>
            ) : (
              <p>${props.price}</p>
            )}
            <h4>Descripcion: {props.description}</h4>
            <div className={styles.buttonModalContainer}>
              <button
                className={styles.discountButton}
                onClick={() => {
                  setProductId(props.id);
                  setDiscountState(true);
                }}
              >
                {props.hasDiscount
                  ? "Modificar descuento"
                  : "Agregar descuento"}
              </button>
              <button
                className={styles.deactivateButton}
                onClick={() => {
                  setProductId(props.id);
                  setDeactivationState(true);
                }}
              >
                {props.isActive ? "Desactivar producto" : "Activar Producto"}
              </button>
              <button
                className={styles.deleteModalButton}
                onClick={() => {
                  setProductId(props.id);
                  setDeleteState(true);
                }}
              >
                Eliminar producto
              </button>
            </div>
            {!props.isActive && (
              <p style={{ color: "red", marginTop: "7px" }}>
                Producto inactivo
              </p>
            )}
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      <section
        className={
          props.hasStar ? styles.productContainerStar : styles.productContainer
        }
      >
        <div className={styles.productContainerHeader}>
          <div className={styles.starContainer}>
            <button
              className={styles.starButton}
              onClick={() => {
                setProductId(props.id);
                setStarState(true);
              }}
            >
              {"\u2B50"}
            </button>
            {props.hasStar && props.isActive && (
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
            {!props.isActive && (
              <p
                style={{ color: "#444", fontStyle: "italic", fontSize: "1rem" }}
              >
                Producto inactivo
              </p>
            )}
          </div>
          <div className={styles.actionsContainer}>
            <Link
              to={`/edit/${props.id}`}
              className={styles.editButton}
              onClick={() => {
                setProductId(props.id);
                window.sessionStorage.setItem(
                  "productData",
                  JSON.stringify(props)
                );
              }}
            >
              <MdEdit />
            </Link>
            <button
              className={styles.deleteButton}
              onClick={() => {
                setProductId(props.id);
                setDeleteState(true);
              }}
            >
              <MdDelete />
            </button>
          </div>
        </div>
        <div
          className={props.isActive === false ? styles.inactiveProduct : ""}
        ></div>
        <div className={styles.productInnerContainer}>
          <div
            className={styles.imgContainer}
            onClick={() => {
              setOpenModal(true);
              setModalContent();
            }}
          >
            {props.image ? (
              <img className={styles.img} src={props.image} alt={props.alt} />
            ) : (
              <img className={styles.noImg} src={noImage} alt={props.alt}></img>
            )}
          </div>
          <div className={styles.productDataContainer}>
            <h3
              onClick={() => {
                setOpenModal(true);
                setModalContent();
              }}
            >
              {props.name}
            </h3>
            <h4
              onClick={() => {
                setOpenModal(true);
                setModalContent();
              }}
            >
              {props.hasDiscount ? (
                <>
                  <p>${calculateDiscount()}</p>
                  <p className={styles.priceDiscount}>${props.price}</p>
                </>
              ) : (
                <p>${props.price}</p>
              )}
            </h4>
            <div className={styles.productButtonContainer}>
              <button
                className={styles.discountButton}
                onClick={() => {
                  setProductId(props.id);
                  setDiscountState(true);
                }}
              >
                {props.hasDiscount
                  ? "Modificar descuento"
                  : "Agregar descuento"}
              </button>
              <button
                className={styles.deactivateButton}
                onClick={() => {
                  setProductId(props.id);
                  setDeactivationState(true);
                }}
              >
                {props.isActive ? "Desactivar producto" : "Activar Producto"}
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
