import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import styles from "./protectedRoutes.module.css";

const ProtectedRoutes = () => {
  const user = window.sessionStorage.getItem("userUid");
  return user ? (
    <>
      <Header />
      <div className={styles.content}>
        <Outlet />
      </div>
    </>
  ) : (
    <div style={{ textAlign: "center" }}>
      ACCESO NO AUTORIZADO, LOGUEATE PARA ACCEDER
    </div>
  );
};

export default ProtectedRoutes;
