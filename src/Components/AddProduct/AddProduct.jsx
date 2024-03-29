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

  const subSelect = ["Lavandina", "Perfumina"];

  const dispatch = useDispatch();

  const userData = JSON.parse(window.sessionStorage.getItem("userData"));

  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");

  const [clicked, setClicked] = useState(false);

  const [category, setCategory] = useState(
    userData.name === "DobleJota" ? "Limpieza y desinfeccion" : ""
  );
  const [subCategory, setSubCategory] = useState("");

  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [discount, setDiscount] = useState(0);

  const calculateDiscount = () => {
    return Math.round(price - (discount / 100) * price);
  };

  const productSchema = Joi.object({
    name: Joi.string().required().min(10).max(50).messages({
      "string.min": "El nombre del producto debe tener al menos 10 caracteres",
      "string.max": "El nombre del producto no debe tener mas de 50 caracteres",
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
    subCategory:
      category === "Limpieza y desinfeccion" && !subCategory
        ? Joi.string().required().messages({
            "any.required": "Este campo es obligatorio",
          })
        : Joi.string(),
    description: Joi.string().required().min(15).max(200).messages({
      "string.min": "La descripcion debe tener al menos 15 caracteres",
      "string.max": "La descripcion no debe tener mas de 200 caracteres",
      "string.empty": "Este campo es obligatorio",
    }),
    stock: Joi.number().min(-9999).max(9999).messages({
      "number.min": "Maximo stock negativo: -9999",
      "number.max": "Maximo stock: 9999",
      "number.base":
        "Este campo es obligatorio (al menos debe haber 0 stock o stock negativo hasta -9999)",
    }),
    hasDiscount: Joi.boolean(),
    discountPercentage: clicked
      ? Joi.number().required().min(0).max(100).messages({
          "number.min": "Entre 0 y 100",
          "number.max": "Entre 0 y 100",
          "any.required": "Este campo es obligatorio",
          "number.base": "Escribi un numero entre el 0 y 100",
        })
      : Joi.allow(),
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

  const extractKeywords = (product) => {
    const { name, description } = product;
    const categoryWord = category;
    const keywords = [];

    // extraer palabras de nombre, descripción y categoría
    const words = [
      ...name.split(" "),
      ...description.split(" "),
      ...categoryWord.split(" "),
    ];

    console.log(words);

    // filtrar palabras con longitud menor a 1
    words.forEach((word) => {
      if (word.length >= 1) {
        keywords.push(word.toLowerCase());
      }
    });

    return keywords;
  };

  const handleProductAdd = (data) => {
    console.log(data);
    const img = url;
    data.hasDiscount = clicked;
    const keywords = extractKeywords(data);
    data.keywords = keywords;
    try {
      dispatch(
        addProduct(data, img, userData.shopId, category, subCategory)
      ).then((response) => {
        console.log(response);
        if (!response.error) {
          alert("Producto agregado con exito");
          reset();
          setCategory("");
          setUrl("");
          setClicked(false);
        } else {
          alert(`Ocurrio un error "${response.message}"`);
        }
      });
    } catch (error) {
      console.log(error);
    }
    setPrice(null);
    setDiscount(null);
  };

  console.log(errors);

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
          defaultValue={
            userData.name === "DobleJota"
              ? "Limpieza y desinfeccion"
              : "SELECCIONE UNA"
          }
          disabled={userData.name === "DobleJota" && true}
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
        {category === "Limpieza y desinfeccion" && (
          <>
            <p>Sub categoria:</p>
            <select
              onChange={(e) => setSubCategory(e.target.value)}
              className={
                !subCategory && errors.subCategory
                  ? styles.selectCategoryError
                  : styles.selectCategory
              }
              defaultValue="SELECCIONE UNA"
            >
              <option value="SELECCIONE UNA" disabled>
                SELECCIONE UNA
              </option>
              {subSelect.map((options) => {
                return (
                  <option key={options} value={options}>
                    {options}
                  </option>
                );
              })}
            </select>
            {errors.subCategory ? (
              <p className={styles.error}>{errors.subCategory?.message}</p>
            ) : (
              ""
            )}
          </>
        )}
        <Input
          type={"text"}
          name={"description"}
          placeholder={"Descripcion"}
          register={register}
          error={errors.description?.message}
        />
        <p
          style={{
            fontSize: "1rem",
            textAlign: "center",
            borderWidth: "3px",
            borderColor: "darkgrey",
            borderStyle: "solid",
            padding: "20px",
          }}
        >
          Para que tu producto aparezca en mas busquedas, siempre es
          recomendable que agregues detalles en la descripcion, como por
          ejemplo: el tamano del producto, el sabor, la marca, caracteristicas
          especiales, etc
        </p>
        <Input
          type={"number"}
          name={"stock"}
          placeholder={"Stock (unidad)"}
          register={register}
          error={errors.stock?.message}
          {...register("stock", {
            onChange: (e) => {
              setStock(e.target.value);
            },
          })}
        />
        {category === "Limpieza y desinfeccion" && (
          <p style={{ marginBottom: 15, fontWeight: "bold" }}>
            {Math.floor(stock / 12)} packs x12 y {stock % 12} u.
          </p>
        )}
        <div className={styles.discountContainer}>
          <div className={styles.hasDiscountContainer}>
            <p>Tiene descuento:</p>
            <Input
              type={"checkbox"}
              name={"hasDiscount"}
              register={register}
              onClick={(e) => {
                setClicked(!clicked);
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
              error={clicked && errors.discountPercentage?.message}
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
