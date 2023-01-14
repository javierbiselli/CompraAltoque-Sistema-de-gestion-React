import styles from "./header.module.css";
import { logOut } from "../../../Redux/auth/thunks";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getUserById } from "../../../Redux/user/thunks";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = getAuth();

  const userUid = JSON.parse(window.sessionStorage.getItem("userUid"));

  useEffect(() => {
    console.log("useeffect usuario");
    dispatch(getUserById(userUid));
  }, []);

  const isLoading = useSelector((state) => state.user.isLoading);
  const userData = useSelector((state) => state.user.user);
  console.log(userData);

  const onLogOut = async () => {
    const resp = await dispatch(logOut());
    if (!resp.error) {
      alert(resp.message);
    }
    window.sessionStorage.removeItem("userUid");
    window.sessionStorage.removeItem("userData");
    navigate("/");
  };

  return (
    <header>
      <ul className={styles.headerUlContainer}>
        <li>
          <Link to="/agregar">Agregar productos</Link>
        </li>
        <li>
          <Link to="/inicio">Ver lista de productos</Link>
        </li>
        <li>
          <button onClick={onLogOut} className={styles.logOutButton}>
            Salir
          </button>
        </li>
      </ul>
      <>
        {isLoading ? (
          <p>cargando...</p>
        ) : (
          <ul className={styles.userDataContainer}>
            <li>
              {userData?.firebaseUid
                ? ""
                : "No autorizado, contacte con soporte si ve este mensaje"}
            </li>
            <li>{userData?.shopName}</li>
            <li>{userData?.shopAddress}</li>
            <li>{userData?.shopTel}</li>
            <li>{userData?.shopDescription}</li>
            <li>{userData?.shopAddress}</li>
            <li>{userData?.shopSchedule}</li>
            <li>{userData?.shopExtraInfo}</li>
          </ul>
        )}
      </>
    </header>
  );
};

export default Header;
