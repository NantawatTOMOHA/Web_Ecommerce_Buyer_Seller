import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.png";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { FaCaretDown } from "react-icons/fa";
import { logout } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { getAllProducts } from "../services/productService";
import { getMyProducts } from "../services/sellerService";

const Navbar = ({ user, onSignOut }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchAndFilter = async () => {
      if (searchQuery.trim() === "") {
        setFilteredProducts([]);
        return;
      }

      if (role === "seller") {
        const products = await getMyProducts();
        const results = products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(results);
      } else {
        const products = await getAllProducts();
        const results = products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(results);
      }
    };

    const timeoutId = setTimeout(fetchAndFilter, 300); // debounce
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchQuery.trim() && role === "seller") {
        navigate(
          `/seller/products?search=${encodeURIComponent(searchQuery.trim())}`
        );
        setSearchQuery("");
        setFilteredProducts([]);
      } else if (searchQuery.trim()) {
        navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery("");
        setFilteredProducts([]);
      }
    }
  };
  const handledropdownsubmit = () => {
    console.log(searchQuery);
    if (searchQuery.trim()) {
      navigate(
        `/seller/products?search=${encodeURIComponent(searchQuery.trim())}`
      );
      setSearchQuery("");
      setFilteredProducts([]);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("user");
      onSignOut();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const role = user?.user?.role;

  return (
    <div className="shadow-md bg-gray-900 text-white duration-200 relative z-40">
      <div className="bg-primary/40 py-2">
        <div className="container flex items-center relative">
          {/* Logo */}
          <Link
            to="/"
            className="font-bold text-2xl sm:text-3xl flex gap-2 items-center"
          >
            <img src={Logo} alt="Logo" className="w-10" />
            Shop
          </Link>

          {/* Menu */}
          <ul className="flex items-center gap-4 ml-10">
            
          {(!user || role === "buyer") && (
            <>
            <li>
              <Link
                to="/"
                className="inline-block px-4 hover:text-yellow-600 duration-200"
              >
                Home
              </Link>
            </li>
              <li>
                <Link
                  to="/products"
                  className="inline-block px-4 hover:text-yellow-600 duration-200"
                >
                  Product
                </Link>
              </li>
              </>
            )}
            {role === "buyer" && (
              <li>
                <Link
                  to="/order"
                  className="inline-block px-4 hover:text-yellow-600 duration-200"
                >
                  Order
                </Link>
              </li>
            )}
            {role === "seller" && (
              <>
                <li>
                  <Link
                    to="/seller/products"
                    className="inline-block px-4 hover:text-yellow-600 duration-200"
                  >
                    Seller Product
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seller/orders"
                    className="inline-block px-4 hover:text-yellow-600 duration-200"
                  >
                    Orders
                  </Link>
                </li>
              </>
            )}
          </ul>
          {/* Search Input */}
          {role !== "seller" && (
            <div className="relative group hidden sm:block ml-auto mr-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                className="w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border borde-gray-500 px-2 py-1 focus:outline-none focus:border-primary bg-gray-800"
              />
              <IoMdSearch className="text-gray-500 group-hover:text-primary absolute top-1/2 -translate-y-1/2 right-3" />
              {filteredProducts.length > 0 && (
                <div className="absolute z-50 bg-white border mt-1 w-full rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className="block px-4 py-2 hover:bg-gray-100 text-sm text-black"
                      onClick={() => {
                        setSearchQuery("");
                        setFilteredProducts([]);
                      }} //Dropdown search results
                    >
                      {product.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {role == "seller" && (
            <div className="relative group hidden sm:block ml-auto mr-4">
              <input
                type="text"
                placeholder="Search my products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                className="w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-500 px-2 py-1 focus:outline-none focus:border-primary bg-gray-800"
              />
              <IoMdSearch className="text-gray-500 group-hover:text-primary absolute top-1/2 -translate-y-1/2 right-3" />
              {filteredProducts.length > 0 && (
                <div className="absolute z-50 bg-white border mt-1 w-full rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      value={searchQuery}
                      className="block px-4 py-2 hover:bg-gray-100 text-sm text-black"
                      onClick={() => {
                        setSearchQuery(product.name);
                        setTimeout(() => {
                          handledropdownsubmit();
                        }, 0);
                      }} //Dropdown search results
                    >
                      {product.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Cart */}
          {role === "buyer" && (
            <button
              onClick={() => navigate("/cart")}
              className="bg-gradient-to-r from-primary to-secondary text-white py-1 px-4 rounded-full flex items-center gap-3 group"
            >
              <span className="group-hover:block hidden">Cart</span>
              <FaCartShopping className="text-xl" />
            </button>
          )}

          {/* Auth section */}
          <div className="flex items-center gap-3 relative">
            {!user ? (
              <>
                <Link
                  to="/Sign-in"
                  className="px-4 py-1 border border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition"
                >
                  Sign in
                </Link>
                <Link
                  to="/Sign-up"
                  className="px-4 py-1 border border-green-600 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <li className="group relative cursor-pointer list-none">
                <span className="flex items-center gap-1 px-4 py-1 text-blue-500 rounded-full hover:text-blue-300 transition">
                  {user.user?.username}
                  <FaCaretDown className="transition-all duration-200 group-hover:rotate-180 mt-[2px]" />
                </span>
                <div className="absolute right-0 hidden group-hover:block w-[150px] rounded-md bg-gray-800 p-2 text-white shadow-md z-50">
                  <ul>
                    <li>
                      <Link
                        to="/profile"
                        className="block w-full rounded-md p-2 hover:bg-gray-700"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left rounded-md p-2 hover:bg-red-200 text-red-500"
                      >
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              </li>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
