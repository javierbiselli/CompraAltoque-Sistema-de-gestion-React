import styles from "./login.module.css";
import { useForm } from "react-hook-form";
import { login } from "../../Redux/auth/thunks";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getUserById } from "../../Redux/user/thunks";
import Loader from "../Shared/Loader/Loader";
import { useState } from "react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { handleSubmit, register } = useForm({
    mode: "onChange",
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const user = await dispatch(login(data));
      if (user.type === "LOGIN_ERROR") {
        setIsLoading(false);
        alert("Email o password incorrectos");
        throw user.payload;
      } else {
        const auth = getAuth();
        window.sessionStorage.setItem(
          "userUid",
          JSON.stringify(auth.currentUser.uid)
        );
        dispatch(getUserById(auth.currentUser.uid)).then((res) => {
          if (!res.error) {
            window.sessionStorage.setItem("userData", JSON.stringify(res.data));
            setIsLoading(false);
            alert("Te logueaste con exito");
            navigate("/inicio");
          } else {
            setIsLoading(false);
            alert("Ocurrio un error");
          }
        });
        return data;
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginWholeContainer}>
        <h2>Login</h2>
        <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            {...register("email")}
            className={styles.loginInput}
          />
          <input
            name="password"
            type="password"
            {...register("password")}
            placeholder="Password"
            className={styles.loginInput}
          />
          <div className={styles.loginButtonContainer}>
            <Loader show={isLoading} />
            <input
              type="submit"
              className={styles.submitLoginButton}
              value="Loguearme"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
