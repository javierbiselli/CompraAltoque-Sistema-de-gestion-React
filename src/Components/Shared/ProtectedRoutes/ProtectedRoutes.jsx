import { Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const user = window.sessionStorage.getItem("userUid");
  return user ? (
    <Outlet />
  ) : (
    <div style={{ textAlign: "center" }}>
      ACCESO NO AUTORIZADO, LOGUEATE PARA ACCEDER
    </div>
  );
};

export default ProtectedRoutes;
