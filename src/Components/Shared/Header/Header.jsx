import styles from "./header.module.css";
import { logOut } from "../../../Redux/auth/thunks";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getUserById } from "../../../Redux/user/thunks";
import { useEffect } from "react";
import { getShopById } from "../../../Redux/shops/thunks";
import logo from "./logoBlanco.png";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userUid = JSON.parse(window.sessionStorage.getItem("userUid"));

  useEffect(() => {
    console.log("USEEFFECT usuario EJECUTADO");
    dispatch(getUserById(userUid)).then((res) => {
      window.sessionStorage.setItem("userData", JSON.stringify(res.data));
    });
    dispatch(
      getShopById(JSON.parse(window.sessionStorage.getItem("userData")).shopId)
    ).then((res) => {
      window.sessionStorage.setItem("shopData", JSON.stringify(res.data));
    });
  }, []);

  const isLoading = useSelector((state) => state.user.isLoading);
  const userData = useSelector((state) => state.user.user);
  const isLoadingShop = useSelector((state) => state.shop.isLoading);
  const shopData = useSelector((state) => state.shop.shop);

  const onLogOut = async () => {
    const resp = await dispatch(logOut());
    if (!resp.error) {
      alert(resp.message);
    }
    window.sessionStorage.removeItem("userUid");
    window.sessionStorage.removeItem("userData");
    window.sessionStorage.removeItem("token");
    window.sessionStorage.removeItem("shopData");
    navigate("/");
  };

  return (
    <header>
      <img src={logo} alt="logo" />
      <ul className={styles.headerUlContainer}>
        <li>
          <Link to="/agregar">Agregar productos</Link>
        </li>
        <li>
          <Link to="/inicio">Ver lista de productos</Link>
        </li>
      </ul>
      <div>
        {isLoading || isLoadingShop ? (
          <p>cargando...</p>
        ) : (
          <ul className={styles.userDataContainer}>
            <p>Detalles de tu negocio:</p>
            <li>
              {userData?.firebaseUid
                ? ""
                : "No autorizado, contacte con soporte si ve este mensaje"}
            </li>
            <li>
              nombre: <b>{shopData.shopName}</b>
            </li>
            <li>
              direccion: <b>{shopData.shopAddress}</b>
            </li>
            <li>
              telefono: <b>{shopData.shopTel}</b>
            </li>
            <li>
              descripcion: <b>{shopData.shopDescription}</b>
            </li>
            <li>
              horarios: <b>{shopData.shopSchedule}</b>
            </li>
            <li>
              Informacion extra: <b>{shopData.shopExtraInfo}</b>
            </li>
            <p>
              Para modificar alguno de estos datos, contactate{" "}
              <Link to="contact" className={styles.contact}>
                aca
              </Link>
            </p>
          </ul>
        )}
      </div>
      <Link to="error-report" className={styles.contact}>
        informar errores
      </Link>
      <button onClick={onLogOut} className={styles.logOutButton}>
        Salir
      </button>
    </header>
  );
};

export default Header;
