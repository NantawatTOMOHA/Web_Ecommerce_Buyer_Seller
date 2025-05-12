import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, getProfile } from "../services/authService";

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!credentials.email) newErrors.email = "Email is required";
    if (!credentials.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await login(credentials);
      const userData = await getProfile();
      onLogin(userData);
      navigate("/");
    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Column */}
      <div className="w-full md:w-2/5 flex items-center justify-center bg-gradient-to-r from-blue-100 via-white to-blue-100 dark:bg-gray-900">
        <form
          onSubmit={handleLogin}
          className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow-lg w-[400px] space-y-4"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
            Welcome Back!
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            Please sign in to continue.
          </p>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={credentials.email}
              onChange={handleChange}
              className={`w-full border p-3 rounded-md ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              className={`w-full border p-3 rounded-md ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition"
          >
            Sign In
          </button>
        </form>
      </div>

      {/* Right Column (Image) */}
      <div className="hidden md:block w-3/5">
        <img
          src="https://images.pexels.com/photos/3768005/pexels-photo-3768005.jpeg?cs=srgb&dl=pexels-willoworld-3768005.jpg&fm=jpg"
          alt="Login visual"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
