import styles from "./header.module.css";
import { logOut } from "../../../Redux/auth/thunks";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogOut = async () => {
    const resp = await dispatch(logOut());
    if (!resp.error) {
      alert(resp.message);
    }
    navigate("/");
    window.sessionStorage.removeItem("userUid");
    window.sessionStorage.removeItem("userData");
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
    </header>
  );
};

export default Header;
