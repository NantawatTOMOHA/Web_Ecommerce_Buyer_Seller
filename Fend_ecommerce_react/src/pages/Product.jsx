import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getAllProducts,
  getSearchedProducts,
} from "../services/productService";
import ProductCard from "../component/Product/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchKeyword = queryParams.get("search");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchKeyword) {
          const data = await getSearchedProducts(searchKeyword);
          setProducts(data);
        } else {
          const data = await getAllProducts();
          setProducts(data);
        }
      } catch (err) {
        console.error("Fetch products error:", err);
      }
    };

    fetchData();
  }, [searchKeyword]);

  return (
    <div className="mt-14 mb-12">
      <div className="container">
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <h1 className="text-3xl font-bold">
            {searchKeyword ? `Results for "${searchKeyword}"` : "Products"}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5">
          {products.length > 0 ? (
            products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                delay={index * 200}
              />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No products found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
