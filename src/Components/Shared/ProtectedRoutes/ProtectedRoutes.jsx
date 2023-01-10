import { Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const user = window.sessionStorage.getItem("userUid");
  return user ? <Outlet /> : <div>NO PERMITIDO</div>;
};

export default ProtectedRoutes;
