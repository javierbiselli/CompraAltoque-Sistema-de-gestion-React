import styles from "./addProduct.module.css";
import { useForm } from "react-hook-form";
import { addProduct } from "../../Redux/products/thunks";
import { useDispatch } from "react-redux";
import Input from "../Shared/Input/Input";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../../firebase";

const AddProduct = () => {
  const dispatch = useDispatch();

  const userData = JSON.parse(window.sessionStorage.getItem("userData"));

  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");

  const [clicked, setClicked] = useState(false);

  const { handleSubmit, register, reset } = useForm({
    mode: "onChange",
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

  const handleProductAdd = (data) => {
    const img = url;
    try {
      dispatch(addProduct(data, img, userData._id)).then((response) => {
        if (!response.error) {
          alert("Producto agregado con exito");
          reset();
          setUrl("");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.addProductContainer}>
      <h3>AGREGAR PRODUCTOS</h3>
      <form onSubmit={handleSubmit(handleProductAdd)}>
        <Input
          type={"text"}
          name={"name"}
          placeholder={"Nombre"}
          register={register}
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
        />
        <Input
          type={"text"}
          name={"category"}
          placeholder={"Categoria"}
          register={register}
        />
        <Input
          type={"text"}
          name={"description"}
          placeholder={"Descripcion"}
          register={register}
        />
        <div className={styles.discountContainer}>
          <div className={styles.hasDiscountContainer}>
            <p>Tiene descuento:</p>
            <Input
              type={"checkbox"}
              name={"hasDiscount"}
              register={register}
              onClick={(e) => setClicked(e.target.checked)}
            />
          </div>
          <div className={clicked ? styles.discountTrue : styles.discountFalse}>
            <Input
              type={"number"}
              name={"discountPercentage"}
              placeholder={"De cuanto es el descuento?"}
              register={register}
              disabled={!clicked ? true : false}
            />
            <p>Hasta cuando es valido el descuento?</p>
            <Input
              type={"datetime-local"}
              name={"discountValidDate"}
              register={register}
              disabled={!clicked ? true : false}
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
