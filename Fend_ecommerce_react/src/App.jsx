import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Product";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import SellerPoduct from "./pages/SellerProduct";
import SellerOrder from "./pages/SellerOrder";
import Payment from "./pages/Payment";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("Loaded user from localStorage:", storedUser);
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid JSON in localStorage:", error);
        localStorage.removeItem("user"); // ลบข้อมูลเสียหาย
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <div>
      <Router>
        <Navbar user={user} onSignOut={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Sign-in" element={<Login onLogin={handleLogin} />} />
          <Route path="/Sign-up" element={<Register onLogin={handleLogin} />} />
          <Route path="/Products" element={<Products user={user} />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/order" element={<Orders />} />
          <Route path="/seller/products" element={<SellerPoduct />} />
          <Route path="/seller/orders" element={<SellerOrder />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
