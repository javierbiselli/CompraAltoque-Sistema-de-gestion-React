import { Link } from "react-router-dom";
import styles from "./modalProduct.module.css";
import noImage from "../../../Resources/Images/productoSinImagen.png";

const ModalProduct = ({
  productData,
  setProductId,
  calculateDiscount,
  setDiscountState,
  setDeactivationState,
  setDeleteState,
  modalTable,
}) => {
  return (
    <section className={styles.modalProductContainer}>
      {!modalTable && (
        <Link
          to={`/edit/${productData._id}`}
          className={styles.editButtonModal}
          onClick={() => {
            setProductId(productData._id);
            window.sessionStorage.setItem(
              "productData",
              JSON.stringify(productData)
            );
          }}
        >
          Editar producto
        </Link>
      )}
      <div
        className={productData.isActive === false ? styles.inactiveProduct : ""}
      ></div>
      <div className={styles.productInnerContainerModal}>
        <div className={styles.imgContainer}>
          {productData.image ? (
            <img
              className={styles.imgModal}
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
          <h3>{productData.name}</h3>
          <h4>Categoria: {productData.category}</h4>
          {productData.category === "Limpieza y desinfeccion" && (
            <h4>Sub categoria: {productData.subCategory}</h4>
          )}
          <h4>Destacado: {productData.hasStar ? "si" : "no"}</h4>
          <h4>
            Descuento:{" "}
            {productData.hasDiscount
              ? "%" + productData.discountPercentage
              : "no"}
          </h4>
          {productData.hasDiscount ? (
            <>
              <p className={styles.priceDiscount}>${productData.price}</p>

              {modalTable ? (
                <p>
                  {Math.round(
                    productData.price -
                      (productData.discountPercentage / 100) * productData.price
                  )}
                </p>
              ) : (
                <p>${calculateDiscount()}</p>
              )}
              <p>
                descuento valido hasta:{" "}
                {productData.discountValidDate
                  ? productData.discountValidDate
                  : "indeterminado"}
              </p>
            </>
          ) : (
            <p>${productData.price}</p>
          )}
          <h4>Descripcion: {productData.description}</h4>
          {productData.category === "Limpieza y desinfeccion" ? (
            <h4 style={{ fontWeight: "bolder" }}>
              Stock: {productData.stock}u. ({Math.floor(productData.stock / 12)}{" "}
              packs x12 y {productData.stock % 12}u.)
            </h4>
          ) : (
            <h4 style={{ fontWeight: "bolder" }}>
              Stock: {productData.stock} u.
            </h4>
          )}
          {!modalTable && (
            <div className={styles.buttonModalContainer}>
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
              <button
                className={styles.deleteModalButton}
                onClick={() => {
                  setProductId(productData._id);
                  setDeleteState(true);
                }}
              >
                Eliminar producto
              </button>
            </div>
          )}
          {!productData.isActive && (
            <p style={{ color: "red", marginTop: "7px" }}>Producto inactivo</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ModalProduct;
