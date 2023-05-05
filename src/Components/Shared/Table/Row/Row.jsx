import React, { useState } from "react";
import styles from "./row.module.css";
import Input from "../../../Shared/Input/Input";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { MdDelete, MdDone, MdSave } from "react-icons/md";
import { BiLoaderAlt, BiError, BiPlus } from "react-icons/bi";
import { deleteProduct, editProduct } from "../../../../Redux/products/thunks";
import { useDispatch } from "react-redux";
import ModalProduct from "../../ModalProduct/ModalProduct";

const Row = ({
  product,
  index,
  openModal,
  setOpenModal,
  children,
  setChildren,
  calculateDiscount,
}) => {
  const dispatch = useDispatch();

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
    subCategory: Joi.string(),
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
    isActive: Joi.boolean(),
    hasDiscount: Joi.boolean(),
    discountPercentage: Joi.number().min(0).max(100),
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
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      description: product.description,
      stock: product.stock,
      isActive: product.isActive,
      hasDiscount: product.hasDiscount,
      discountPercentage:
        product.discountPercentage && product.hasDiscount
          ? product.discountPercentage
          : 0,
      discountValidDate: product.discountValidDate,
    },
  });

  const [icon, setIcon] = useState(0);
  const [deleteIcon, setDeleteIcon] = useState(0);

  const extractKeywords = (product) => {
    const { name, description } = product;
    const keywords = [];

    // extraer palabras de nombre, descripción y categoría
    const words = [...name.split(" "), ...description.split(" ")];

    // filtrar palabras con longitud menor a 1
    words.forEach((word) => {
      if (word.length >= 1) {
        keywords.push(word.toLowerCase());
      }
    });

    return keywords;
  };

  const onEdit = (data) => {
    setIcon(1);
    const keywords = extractKeywords(data);
    data.keywords = keywords;
    const hasDiscount = data.discountPercentage !== 0 ? true : false;
    data.hasDiscount = hasDiscount;
    try {
      dispatch(editProduct(data, product._id)).then((response) => {
        if (!response.error) {
          setIcon(2);
          setTimeout(() => {
            setIcon(0);
          }, 5000);
        } else {
          alert(`Ocurrio un error "${response.message}"`);
          setIcon(3);
        }
      });
    } catch (error) {
      console.log(error);
      setIcon(3);
    }
  };

  const onDelete = () => {
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar ${product.name}?`
    );
    if (confirmed) {
      setDeleteIcon(1);
      try {
        dispatch(deleteProduct(product._id)).then((response) => {
          if (!response.error) {
            setDeleteIcon(2);
          } else {
            alert(`Ocurrió un error "${response.message}"`);
            setDeleteIcon(1);
          }
        });
      } catch (error) {
        console.log(error);
        setDeleteIcon(1);
      }
    }
  };

  if (!openModal) {
    setChildren("");
  }

  return (
    <tr
      key={index}
      className={
        !product.isActive
          ? styles.rowContainerInactive
          : product.hasStar
          ? styles.rowContainerStar
          : styles.rowContainer
      }
      title={
        !product.isActive
          ? "Producto inactivo"
          : product.hasStar
          ? "Producto destacado"
          : ""
      }
    >
      <td style={{ position: "relative" }}>
        <span
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <button
            type="submit"
            onClick={onDelete}
            className={`${styles.tableButton} ${styles.tableButtonDelete}`}
          >
            {deleteIcon === 0 ? (
              <MdDelete title="Borrar producto" />
            ) : (
              <BiLoaderAlt className={styles.loader} title="Cargando..." />
            )}
          </button>
          <Input
            type={"text"}
            name={"name"}
            register={register}
            error={errors.name?.message}
            table={true}
          />
        </span>
      </td>
      <td>
        <Input
          type={"number"}
          name={"price"}
          register={register}
          error={errors.price?.message}
          table={true}
        />
      </td>
      <td>
        <Input
          type={"number"}
          name={"discountPercentage"}
          register={register}
          error={errors.discountPercentage?.message}
          table={true}
          title={
            product.hasDiscount
              ? `Precio final con descuento: ${Math.round(
                  product.price -
                    (product.discountPercentage / 100) * product.price
                )}`
              : ""
          }
        />
      </td>
      <td>
        <Input
          type={"text"}
          name={"description"}
          register={register}
          error={errors.description?.message}
          table={true}
        />
      </td>
      <td>
        <Input
          type={"number"}
          name={"stock"}
          register={register}
          error={errors.stock?.message}
          table={true}
        />
      </td>
      <td>
        <span
          style={{
            display: "flex",
          }}
        >
          <button
            onClick={() => {
              setOpenModal(true);
              setChildren(
                <ModalProduct
                  productData={product}
                  calculateDiscount={calculateDiscount}
                  modalTable={true}
                  // setProductId={setProductId}
                  // setDiscountState={setDiscountState}
                  // setDeactivationState={setDeactivationState}
                  // setDeleteState={setDeleteState}
                />
              );
            }}
            className={styles.tableButton}
            style={{ marginRight: "5px" }}
          >
            <BiPlus title="Ver mas detalles" />
          </button>
          <button
            type="submit"
            onClick={handleSubmit(onEdit)}
            className={styles.tableButton}
          >
            {icon === 0 ? (
              <MdSave title="Guardar cambios" />
            ) : icon === 1 ? (
              <BiLoaderAlt className={styles.loader} title="Cargando..." />
            ) : icon === 2 ? (
              <MdDone title="Cambios guardados" />
            ) : (
              <BiError title="Ocurrio un error, si persiste, recarga la pagina o deslogueate y volve a loguearte" />
            )}
          </button>
        </span>
      </td>
    </tr>
  );
};

export default Row;
