import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { editProduct } from "../../Redux/products/thunks";
import Input from "../Shared/Input/Input";
import styles from "./editProduct.module.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../../firebase";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

const EditProduct = () => {
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
  const navigate = useNavigate();

  const productData = JSON.parse(window.sessionStorage.getItem("productData"));

  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");

  const [category, setCategory] = useState(productData.category);

  useEffect(() => {
    setUrl(productData.image);
  }, [productData.image]);

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
    category: Joi.string(),
    description: Joi.string().required().min(15).max(200).messages({
      "string.min": "La descripcion debe tener al menos 15 caracteres",
      "string.max": "La descripcion no debe tener mas de 200 caracteres",
      "string.empty": "Este campo es obligatorio",
    }),
    isActive: Joi.boolean(),
    hasDiscount: Joi.boolean(),
    discountPercentage: Joi.number(),
    discountValidDate: Joi.allow(),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: joiResolver(productSchema),
    defaultValues: {
      name: productData.name,
      price: productData.price,
      image: productData.image,
      description: productData.description,
      // category: productData.category,
      isActive: productData.isActive,
      hasDiscount: productData.hasDiscount,
      discountPercentage: productData.discountPercentage,
      discountValidDate: productData.discountValidDate,
    },
  });

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

  const handleProductEdit = (data) => {
    const keywords = extractKeywords(data);
    data.keywords = keywords;
    const img = url;
    try {
      dispatch(editProduct(data, productData.id, img, category)).then(
        (response) => {
          if (!response.error) {
            alert("Producto modificado correctamente");
            navigate("/inicio");
          } else {
            alert(`${response.message}`);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className={styles.editModalContainer}>
      <h3>Editar producto</h3>
      <form
        onSubmit={handleSubmit(handleProductEdit)}
        className={styles.editModalForm}
      >
        <div className={styles.editInputContainer}>
          <label htmlFor="name">
            Nombre: <span style={{ color: "red" }}>*</span>
          </label>
          <Input
            type={"text"}
            name={"name"}
            placeholder={"Nombre"}
            register={register}
            error={errors.name?.message}
          />
        </div>
        <div className={styles.editInputContainer}>
          <label htmlFor="image">Imagen:</label>
          <input
            type="text"
            name="image"
            placeholder="URL de imagen"
            {...register("image")}
            disabled={url && true}
            value={url ? url : undefined}
            onChange={(e) => setUrl(e.target.value)}
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
        </div>
        <div className={styles.editInputContainer}>
          <label htmlFor="price">
            Precio: <span style={{ color: "red" }}>*</span>
          </label>
          <Input
            type={"number"}
            name={"price"}
            placeholder={"Precio"}
            register={register}
            error={errors.price?.message}
          />
        </div>
        <div className={styles.editInputContainer}>
          <label htmlFor="category">
            Categoria: <span style={{ color: "red" }}>*</span>
          </label>
          <select
            onChange={(e) => setCategory(e.target.value)}
            defaultValue={category}
            className={styles.selectCategory}
          >
            {select.map((options) => {
              return (
                <option key={options} value={options}>
                  {options}
                </option>
              );
            })}
          </select>
        </div>
        <div className={styles.editInputContainer}>
          <label htmlFor="description">
            Descripcion: <span style={{ color: "red" }}>*</span>
          </label>
          <Input
            type={"text"}
            name={"description"}
            placeholder={"Descripcion"}
            register={register}
            error={errors.description?.message}
          />
        </div>
        <input
          type="submit"
          value="Editar"
          className={styles.editProductButton}
        />
      </form>
    </section>
  );
};

export default EditProduct;
