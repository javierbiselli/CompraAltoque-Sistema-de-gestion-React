import styles from "./login.module.css";
import { useForm } from "react-hook-form";
import { login } from "../../Redux/auth/thunks";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getUserById } from "../../Redux/user/thunks";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { handleSubmit, register } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const user = await dispatch(login(data));
      if (user.type === "LOGIN_ERROR") {
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
            alert("Te logueaste con exito");
            navigate("/inicio");
          } else {
            alert("Ocurrio un error");
          }
        });
        return data;
      }
    } catch (error) {
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
