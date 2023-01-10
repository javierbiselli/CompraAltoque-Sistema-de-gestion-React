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
}) => {
  return (
    <div className={styles.container}>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        {...register(name)}
        className={error ? styles.errorRed : styles.input}
        onBlur={onBlur}
        disabled={disabled}
        pattern={pattern}
        value={value}
        onClick={onClick}
      ></input>
    </div>
  );
};

export default Input;
