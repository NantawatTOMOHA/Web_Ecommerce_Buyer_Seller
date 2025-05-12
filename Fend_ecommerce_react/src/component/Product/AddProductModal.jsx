import React, { useState } from "react";

const AddProductModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    imageBase64: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      if (!file) return;

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image:
            "Invalid file type. Please upload a JPG, PNG, GIF, or WEBP image.",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageBase64: reader.result }));
        setErrors((prev) => ({ ...prev, image: "" }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Please enter a product name.";
    if (!formData.description.trim())
      newErrors.description = "Please enter a description.";
    if (!formData.price || parseFloat(formData.price) < 0)
      newErrors.price = "Price must be a positive number.";
    if (!formData.quantity || parseInt(formData.quantity) < 1)
      newErrors.quantity = "Quantity must be a positive number.";
    if (!formData.imageBase64) newErrors.image = "Please upload a valid image.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      quantity: formData.quantity,
      image_base64: formData.imageBase64,
    };
    console.log("Submitting product payload:", payload);
    onAdd(payload); // ส่งข้อมูลที่รวม base64 image ไปยังฟังก์ชัน onAdd
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Add New Product
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              name="name"
              onChange={handleChange}
              className={`w-full border p-2 rounded-lg ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              onChange={handleChange}
              rows={8}
              className={`w-full border p-2 rounded-lg ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Product description"
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Price & Quantity */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                name="price"
                onChange={handleChange}
                className={`w-full border p-2 rounded-lg ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-sm text-red-500 mt-1">{errors.price}</p>
              )}
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                onChange={handleChange}
                className={`w-full border p-2 rounded-lg ${
                  errors.quantity ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="1"
              />
              {errors.quantity && (
                <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>
              )}
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className={`w-full text-sm ${
                errors.image ? "border border-red-500" : ""
              }`}
            />
            {errors.image && (
              <p className="text-sm text-red-500 mt-1">{errors.image}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
