import React, { useEffect, useState } from "react";
import {
  getMyProducts,
  deleteProduct,
  addProduct,
  updateProduct,
  getSearchedMyProducts,
} from "../services/sellerService";
import SellerCard from "../component/Product/SellerCard";
import AddProductModal from "../component/Product/AddProductModal";
import EditProductModal from "../component/Product/EditProductModal";
import ProductDetailModal from "../component/Product/ProductDetailModal";
import { useLocation } from "react-router-dom";

const SellerProduct = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null); // <<== NEW
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchKeyword = queryParams.get("search");

  const fetchMyProducts = async () => {
    try {
      if (searchKeyword) {
        const data = await getSearchedMyProducts(searchKeyword);
        setProducts(data);
      } else {
        const res = await getMyProducts();
        setProducts(Array.isArray(res) ? res : []);
      }
    } catch (error) {
      console.error("Failed to fetch seller products:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, [searchKeyword]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((p) => p.id !== id));
      } catch {
        alert("Failed to delete product.");
      }
    }
  };

  const handleAdd = async (newProduct) => {
    try {
      await addProduct(newProduct);
      setShowModal(false);
      fetchMyProducts();
    } catch {
      alert("Failed to add product.");
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
  };

  const handleUpdate = async (id, formData) => {
    try {
      await updateProduct(id, formData);
      setEditProduct(null);
      fetchMyProducts();
    } catch {
      alert("Failed to update product.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {searchKeyword ? `Results for "${searchKeyword}"` : "My Products"}
        </h1>
        <button
          className="bg-gray-800 hover:bg-green-600 text-white px-4 py-2 rounded hover:shadow-xl transition duration-300"
          onClick={() => setShowModal(true)}
        >
          Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <SellerCard
              key={product.id}
              product={product}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onView={() => setDetailProduct(product)} // <<== NEW
            />
          ))}
        </div>
      )}

      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}

      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onUpdate={handleUpdate}
        />
      )}

      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)} // <<== NEW
        />
      )}
    </div>
  );
};

export default SellerProduct;
