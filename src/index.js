import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./Components/Home/Home";
import { Provider } from "react-redux";
import store from "./Redux/store";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProtectedRoutes from "./Components/Shared/ProtectedRoutes/ProtectedRoutes";
import Login from "./Components/Login/Login";
import AddProduct from "./Components/AddProduct/AddProduct";
import EditProduct from "./Components/EditProduct/EditProduct";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/inicio" element={<Home />} />
          <Route path="/agregar" element={<AddProduct />} />
          <Route path="/edit/*" element={<EditProduct />} />
          <Route
            path="/*"
            element={
              <div style={{ textAlign: "center", fontSize: "1.5rem" }}>
                <p>que estas buscando? aca no hay nada </p>
                <Link to="/inicio">VOLVER A INICIO</Link>
              </div>
            }
          />
        </Route>
        <Route path="/" element={<Login />} />
      </Routes>
    </Provider>
  </BrowserRouter>
);
