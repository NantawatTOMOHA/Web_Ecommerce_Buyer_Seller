import React, { useState } from "react";

const EditProductModal = ({ product, onClose, onUpdate }) => {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [quantity, setQuantity] = useState(product.quantity);
  const [imageBase64, setImageBase64] = useState(product.image || null); // รองรับกรณีมีรูปอยู่แล้ว

  const [errors, setErrors] = useState({});

  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "name":
        if (!value.trim()) error = "Please enter a product name";
        break;
      case "description":
        if (!value.trim()) error = "Please enter a description";
        break;
      case "price":
        if (value === "" || value < 0)
          error = "Price must be a positive number";
        break;
      case "quantity":
        if (value === "" || value < 0)
          error = "Quantity must be a positive number";
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    validateField("name", name);
    validateField("description", description);
    validateField("price", price);
    validateField("quantity", quantity);

    const hasErrors = Object.values(errors).some((err) => err);
    if (hasErrors || !name || !description || price === "" || quantity === "")
      return;

    const updatedProduct = {
      name,
      description,
      price,
      quantity,
      image_base64: imageBase64,
    };

    onUpdate(product.id, updatedProduct);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Edit Product
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                validateField("name", e.target.value);
              }}
              className={`w-full p-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? "focus:ring-red-500" : "focus:ring-green-500"
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
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                validateField("description", e.target.value);
              }}
              rows={8}
              className={`w-full p-2 border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.description
                  ? "focus:ring-red-500"
                  : "focus:ring-green-500"
              }`}
              placeholder="Enter product description"
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
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  validateField("price", e.target.value);
                }}
                className={`w-full p-2 border ${
                  errors.price ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 ${
                  errors.price ? "focus:ring-red-500" : "focus:ring-green-500"
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
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  validateField("quantity", e.target.value);
                }}
                className={`w-full p-2 border ${
                  errors.quantity ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 ${
                  errors.quantity
                    ? "focus:ring-red-500"
                    : "focus:ring-green-500"
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
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {imageBase64 && (
              <img
                src={imageBase64}
                alt="Preview"
                className="mt-2 max-h-40 object-contain border rounded"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
