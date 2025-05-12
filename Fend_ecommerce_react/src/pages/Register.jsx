import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, login, getProfile } from "../services/authService";

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    lastname: "",
    role: "buyer",
    agreeToPolicy: false,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.name || !formData.lastname)
      newErrors.fullName = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.agreeToPolicy)
      newErrors.agreeToPolicy = "You must agree to the policy";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const fullName = `${formData.name} ${formData.lastname}`;
      const payload = { ...formData, fullName };
      delete payload.name;
      delete payload.lastname;

      await register(payload);
      await login({ email: formData.email, password: formData.password });
      const profile = await getProfile();
      onLogin(profile);
      navigate("/");
    } catch (err) {
      console.error("An error occurred: ", err);
      setErrors({ general: "Registration failed. Please try again." });
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Column */}
      <div className="w-full md:w-2/5 flex items-center justify-center bg-gradient-to-r from-blue-100 via-white to-blue-100 dark:bg-gray-900">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow-lg w-[400px] space-y-4"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
            Create Account
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            Please fill in the information below.
          </p>

          {errors.general && (
            <p className="text-red-500 text-center">{errors.general}</p>
          )}

          {[
            { name: "username", label: "Username", type: "text" },
            { name: "name", label: "First Name", type: "text" },
            { name: "lastname", label: "Last Name", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "password", label: "Password", type: "password" },
            {
              name: "confirmPassword",
              label: "Confirm Password",
              type: "password",
            },
          ].map(({ name, label, type }) => (
            <div key={name}>
              <label className="block text-white mb-1">{label}</label>
              <input
                type={type}
                name={name}
                placeholder={label}
                value={formData[name]}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded-md ${
                  errors[name] ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors[name] && (
                <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
              )}
            </div>
          ))}

          <div>
            <label className="block text-white mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="agreeToPolicy"
              checked={formData.agreeToPolicy}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-white">I agree to the privacy policy</label>
          </div>
          {errors.agreeToPolicy && (
            <p className="text-red-500 text-sm mt-1">{errors.agreeToPolicy}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition"
          >
            Register
          </button>
        </form>
      </div>

      {/* Right Column (Image) */}
      <div className="hidden md:block w-3/5">
        <img
          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
          alt="Register visual"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Register;
