import styles from "./sendErrors.module.css";
import { Link } from "react-router-dom";

const SendErrors = () => {
  return (
    <div className={styles.sendErrorContainer}>
      Informe de errores: en desarrollo, pronto disponible.
      <div>
        Si encuentra algun error o la aplicacion no le responde de la manera
        deseada, intente cerrar y volver a abrir el sistema de gestion, o
        deslogueese haciendo click en el boton "Salir" y vuelva a loguearse. Si
        el problema persiste, contactese haciendo click
        <Link to="/contact"> aqui</Link>
      </div>
    </div>
  );
};

export default SendErrors;
