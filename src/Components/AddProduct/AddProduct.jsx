import styles from "./addProduct.module.css";
import { useForm } from "react-hook-form";
import { addProduct } from "../../Redux/products/thunks";
import { useDispatch } from "react-redux";
import Input from "../Shared/Input/Input";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../../firebase";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

const AddProduct = () => {
  const select = [
    "Leche y derivados",
    "Fiambres, embutidos y encurtidos",
    "Carnes",
    "Frutas y verduras",
    "Comidas preparadas",
    "Salsas y aderezos",
    "Especias y condimentos",
    "Repostería y panaderia",
    "Helados y postres",
    "Enlatados",
    "Pastas secas y arroz",
    "Sopas, caldos y puré",
    "Harinas",
    "Aceites",
    "Golosinas, alfajores y chocolates",
    "Galletitas",
    "Infusiones",
    "Mermeladas, dulces y miel",
    "Snacks",
    "Bebidas sin alcohol",
    "Bebidas con alcohol",
    "Farmacia y cuidado personal",
    "Limpieza y desinfeccion",
    "Alimentos y accesorios para mascotas",
  ];

  const dispatch = useDispatch();

  const userUid = JSON.parse(window.sessionStorage.getItem("userUid"));
  const userData = JSON.parse(window.sessionStorage.getItem("userData"));

  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");

  const [clicked, setClicked] = useState(false);

  const [category, setCategory] = useState("");

  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);

  const calculateDiscount = () => {
    return Math.round(price - (discount / 100) * price);
  };

  const productSchema = Joi.object({
    name: Joi.string().required().min(10).max(30).messages({
      "string.min": "El nombre del producto debe tener al menos 10 caracteres",
      "string.max": "El nombre del producto no debe tener mas de 30 caracteres",
      "string.empty": "Este campo es obligatorio",
    }),
    image: Joi.string().min(0),
    price: Joi.number().required().min(1).max(999999).messages({
      "number.min": "Entre 1 y 999999",
      "number.max": "Entre 1 y 999999",
      "number.base": "Este campo es obligatorio",
    }),
    category: !category
      ? Joi.string().required().messages({
          "any.required": "Este campo es obligatorio",
        })
      : Joi.string(),
    description: Joi.string().required().min(15).max(200).messages({
      "string.min": "La descripcion debe tener al menos 15 caracteres",
      "string.max": "La descripcion no debe tener mas de 200 caracteres",
      "string.empty": "Este campo es obligatorio",
    }),
    hasDiscount: Joi.boolean(),
    discountPercentage: clicked
      ? Joi.number().required().min(0).max(100).messages({
          "number.min": "Entre 0 y 100",
          "number.max": "Entre 0 y 100",
          "any.required": "Este campo es obligatorio",
        })
      : Joi.number(),
    discountValidDate: Joi.allow(),
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: joiResolver(productSchema),
  });

  const storageRef = ref(
    storage,
    `${window.sessionStorage.getItem("userUid")}/${v4()}`
  );

  // const deleteImg = () => {
  //   const deleteRef = ref(
  //     storage,
  //     `${window.sessionStorage.getItem("userUid")}/$`
  //   );
  //   getMetadata(deleteRef)
  //     .then((metadata) => {
  //       console.log(metadata);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const uploadImg = () => {
    uploadBytes(storageRef, image)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            setUrl(() => url);
          })
          .catch((error) => {
            alert(error.message);
          });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  if (image) {
    uploadImg();
    setImage(null);
  }

  const handleProductAdd = (data) => {
    const img = url;
    data.hasDiscount = clicked;
    try {
      dispatch(addProduct(data, img, userData.shopId, category)).then(
        (response) => {
          if (!response.error) {
            alert("Producto agregado con exito");
            reset();
            setCategory("");
            setUrl("");
            setClicked(false);
          } else {
            alert(`Ocurrio un error "${response.message}"`);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
    setPrice(null);
    setDiscount(null);
  };

  console.log(discount);

  console.log(clicked);

  return (
    <div className={styles.addProductContainer}>
      <h3>AGREGAR PRODUCTOS</h3>
      <form onSubmit={handleSubmit(handleProductAdd)}>
        <Input
          type={"text"}
          name={"name"}
          placeholder={"Nombre"}
          register={register}
          error={errors.name?.message}
        />
        <input
          type="text"
          name="image"
          placeholder="URL de imagen"
          {...register("image")}
          disabled={url && true}
          value={url ? url : undefined}
          onBlur={(e) => setUrl(e.target.value)}
          className={styles.urlInput}
        />
        {url && (
          <div className={styles.imageContainer}>
            <span className={styles.deleteButton} onClick={() => setUrl("")}>
              X
            </span>
            <img src={url} alt={"product"} className={styles.productImage} />
          </div>
        )}
        <p>o subi la imagen desde tu dispositivo</p>
        <input
          type="file"
          name="file"
          accept="image/x-png,image/jpeg"
          className={styles.uploadPhoto}
          disabled={url && true}
          onChange={(e) => {
            if (e.target.files[0].size > 3145728) {
              alert("La imagen no puede exceder los 3 mb");
            } else {
              setImage(e.target.files[0]);
            }
          }}
        />
        <Input
          type={"number"}
          name={"price"}
          placeholder={"Precio"}
          register={register}
          error={errors.price?.message}
          {...register("price", {
            onChange: (e) => {
              setPrice(e.target.value);
            },
          })}
        />
        <p>Categoria:</p>
        <select
          onChange={(e) => setCategory(e.target.value)}
          className={
            !category && errors.category
              ? styles.selectCategoryError
              : styles.selectCategory
          }
          defaultValue="SELECCIONE UNA"
        >
          <option value="SELECCIONE UNA" disabled>
            SELECCIONE UNA
          </option>
          {select.map((options) => {
            return (
              <option key={options} value={options}>
                {options}
              </option>
            );
          })}
        </select>
        {!category && errors.category ? (
          <p className={styles.error}>{errors.category?.message}</p>
        ) : (
          ""
        )}
        <Input
          type={"text"}
          name={"description"}
          placeholder={"Descripcion"}
          register={register}
          error={errors.description?.message}
        />
        <div className={styles.discountContainer}>
          <div className={styles.hasDiscountContainer}>
            <p>Tiene descuento:</p>
            <Input
              type={"checkbox"}
              name={"hasDiscount"}
              register={register}
              onClick={(e) => {
                setClicked(!clicked);
                discount && setDiscount(0);
              }}
            />
          </div>
          <div className={clicked ? styles.discountTrue : styles.discountFalse}>
            <Input
              type={"number"}
              name={"discountPercentage"}
              placeholder={"De cuanto es el descuento?"}
              register={register}
              disabled={!clicked ? true : false}
              error={errors.discountPercentage?.message}
              value={!clicked ? 0 : undefined}
              {...register("discountPercentage", {
                onChange: (e) => {
                  setDiscount(e.target.value);
                },
              })}
            />
            <p style={{ marginTop: 5, marginBottom: 20, fontWeight: "bold" }}>
              {clicked &&
                `Precio con descuento del ${discount}%: $` +
                  calculateDiscount()}
            </p>
            <p>Hasta cuando es valido el descuento?</p>
            <Input
              type={"datetime-local"}
              name={"discountValidDate"}
              register={register}
              disabled={!clicked ? true : false}
              error={errors.discountValidDate?.message}
            />
          </div>
        </div>
        <input
          type="submit"
          value="Agregar"
          className={styles.addProductButton}
        />
      </form>
    </div>
  );
};

export default AddProduct;
