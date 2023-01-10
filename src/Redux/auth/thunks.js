import {
  loginPending,
  loginSuccess,
  loginError,
  getAuthenticationError,
  getAuthenticationSuccess,
  getAuthenticationPending,
  setAuthentication,
} from "./actions";
import firebaseApp from "../../firebase/index";

export const login = (credentials) => {
  return (dispatch) => {
    dispatch(loginPending());
    return firebaseApp
      .auth()
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(async (response) => {
        const token = await response.user.getIdToken();
        const userUID = await response.user.uid;
        const {
          claims: { role },
        } = await response.user.getIdTokenResult();
        return dispatch(loginSuccess({ role, token, userUID }));
      })
      .catch((error) => {
        return dispatch(loginError(error.toString()));
      });
  };
};

export const getAuth = (token) => {
  return (dispatch) => {
    dispatch(getAuthenticationPending());
    return fetch(`${process.env.REACT_APP_API_URL}/auth/`, {
      headers: { token },
    })
      .then((response) => response.json())
      .then((response) => {
        dispatch(getAuthenticationSuccess(response.data));
        return response.data;
      })
      .catch((error) => {
        dispatch(getAuthenticationError(error.toString()));
      });
  };
};

export const logOut = () => {
  return (dispatch) => {
    return firebaseApp
      .auth()
      .signOut()
      .then(() => {
        dispatch(setAuthentication());
        return { error: false, message: "Saliste con exito" };
      })
      .catch((error) => {
        console.error(error);
        return {
          error: true,
          message: error,
        };
      });
  };
};
