import React from "react";
import styles from "./input.module.css";

const Input = ({
  type,
  name,
  placeholder,
  register,
  error,
  disabled,
  pattern,
  value,
  onBlur,
  onClick,
  min,
  max,
  defaultValue,
  table,
  title,
}) => {
  return (
    <div className={styles.container}>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        {...register(name)}
        className={error ? styles.errorRed : styles.input}
        style={
          table && {
            borderRadius: "0",
            boxShadow: "none",
            textAlign: "center",
            backgroundColor: "transparent",
            border: error ? "#ff0000 solid 2px" : "none",
          }
        }
        onBlur={onBlur}
        disabled={disabled}
        pattern={pattern}
        value={value}
        onClick={onClick}
        min={min}
        max={max}
        defaultValue={defaultValue}
        title={title}
      ></input>
      {error && !table && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default Input;
