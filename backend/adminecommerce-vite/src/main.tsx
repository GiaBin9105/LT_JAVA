import React from "react";
import ReactDOM from "react-dom/client";
import { Admin, Resource, CustomRoutes, defaultTheme } from "react-admin";
import { ThemeOptions } from "@mui/material/styles"; // ✅ dùng ThemeOptions thay vì Theme
import { Route } from "react-router-dom";

import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";

// 🧩 Categories
import { CategoryList } from "./categories/CategoryList";
import { CategoryCreate } from "./categories/CategoryCreate";
import { CategoryEdit } from "./categories/CategoryEdit";

// 🧩 Products
import { ProductList } from "./products/ProductList";
import { ProductCreate } from "./products/ProductCreate";
import { ProductEdit } from "./products/ProductEdit";

// 🧩 Users
import { UserList } from "./users/UserList";
import { UserCreate } from "./users/UserCreate";
import { UserEdit } from "./users/UserEdit";

// 🧩 Orders
import { OrderList } from "./orders/OrderList";
import { OrderShow } from "./orders/OrderShow";
import { OrderEdit } from "./orders/OrderEdit";

// 🧩 Carts
import { CartList } from "./carts/CartList";
import { CartShow } from "./carts/CartShow";
import { CartEdit } from "./carts/CartEdit";

// 🧩 Favorites
import { FavoriteList } from "./favorites/FavoriteList";
import { FavoriteShow } from "./favorites/FavoriteShow";
import { FavoriteEdit } from "./favorites/FavoriteEdit";

// ☕️ Theme chủ đạo CoffeeShop
const coffeeTheme: ThemeOptions = {
  ...defaultTheme,
  palette: {
    mode: "light",
    primary: {
      main: "#C67C4E", // Nâu cà phê
      contrastText: "#fff",
    },
    secondary: {
      main: "#E8B07A", // Màu caramel
    },
    background: {
      default: "#FFF8F1", // Nền sáng kem
      paper: "#ffffff",
    },
    text: {
      primary: "#4B2E05", // Chữ nâu đậm
      secondary: "#7B4A12",
    },
  },
  typography: {
    fontFamily: `"Poppins", "Roboto", "Helvetica", "Arial", sans-serif`,
    h5: {
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
};

// 🚀 Render ứng dụng React-Admin
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Admin
      theme={coffeeTheme}
      dataProvider={dataProvider}
      authProvider={authProvider}
    >
      {/* 📂 Danh mục */}
      <Resource
        name="categories"
        list={CategoryList}
        create={CategoryCreate}
        edit={CategoryEdit}
      />

      {/* ☕ Sản phẩm */}
      <Resource
        name="products"
        list={ProductList}
        create={ProductCreate}
        edit={ProductEdit}
      />

      {/* 👤 Người dùng */}
      <Resource
        name="users"
        list={UserList}
        create={UserCreate}
        edit={UserEdit}
      />

      {/* 🧾 Đơn hàng */}
      <Resource
        name="orders"
        list={OrderList}
        show={OrderShow}
        edit={OrderEdit}
      />

      {/* 🛒 Giỏ hàng */}
      <Resource
        name="carts"
        list={CartList}
        show={CartShow}
        edit={CartEdit}
      />

      {/* ❤️ Yêu thích */}
      <Resource
        name="favorites"
        list={FavoriteList}
        show={FavoriteShow}
        edit={FavoriteEdit}
      />

      {/* 📜 Route tùy chỉnh (nếu cần sau này) */}
      <CustomRoutes>
        <Route path="/custom" element={<div>Trang tùy chỉnh</div>} />
      </CustomRoutes>
    </Admin>
  </React.StrictMode>
);
