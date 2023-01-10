import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./Components/Home/Home";
import { Provider } from "react-redux";
import store from "./Redux/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Components/Shared/Header/Header";
import ProtectedRoutes from "./Components/Shared/ProtectedRoutes/ProtectedRoutes";
import Login from "./Components/Login/Login";
import AddProduct from "./Components/AddProduct/AddProduct";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
      <Header />
      <div className="content">
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/inicio" element={<Home />} />
            <Route path="/agregar" element={<AddProduct />} />
          </Route>
        </Routes>
      </div>
    </Provider>
  </BrowserRouter>
);
