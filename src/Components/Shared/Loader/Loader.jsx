import React from "react";
import styles from "./loader.module.css";

const Loader = ({ show, small }) => {
  if (!show) {
    return null;
  }
  return (
    <span
      className={
        small ? `${styles.loader} ${styles.buttonLoader}` : styles.loader
      }
    ></span>
  );
};

export default Loader;
