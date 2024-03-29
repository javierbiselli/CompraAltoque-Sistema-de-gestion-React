import styles from "./table.module.css";
import Row from "./Row/Row";
import { useState } from "react";

const Table = ({
  listProducts,
  openModal,
  setOpenModal,
  children,
  setChildren,
  calculateDiscount,
}) => {
  const [list, setList] = useState(listProducts);

  if (list !== listProducts) {
    setList(listProducts);
  }

  return (
    <div className={styles.tableContainer}>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>% Desc</th>
            <th>Descripcion</th>
            <th>Stock</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {list.map((product, index) => (
            <Row
              key={product._id}
              product={product}
              index={index}
              openModal={openModal}
              setOpenModal={setOpenModal}
              children={children}
              setChildren={setChildren}
              calculateDiscount={calculateDiscount}
            />
          ))}
        </tbody>
      </table>
      {/* <button>Guardar cambios</button> */}
    </div>
  );
};

export default Table;
