import React, { useEffect, useState } from "react";
import { getAllProducts } from "../services/productService";

const TestProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts()
      .then((data) => {
        console.log("API Response:", data);
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-center text-3xl font-bold mb-5">Test Products</h1>
      <div>
        {products.length === 0 ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="p-4 border rounded-md shadow-md">
                <img
                  src={`data:image/jpeg;base64,${product.image_base64}`}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md"
                />
                <h3 className="text-xl font-semibold mt-2">{product.name}</h3>
                <p>{product.description}</p>
                <p className="font-bold text-primary">${product.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestProducts;
