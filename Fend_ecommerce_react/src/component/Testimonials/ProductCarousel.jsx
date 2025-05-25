import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import ProductCard from "../Product/ProductCard"; 
import { getAllProducts } from "../../services/productService";

const ProductCarousel = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 10000,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="py-10 mb-10">
      <div className="container">
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p className="text-sm text-primary">
            Featured Products
          </p>
          <h1 className="text-3xl font-bold">
            Our Top Picks
          </h1>
          <p className="text-xs text-gray-400">
            Check out our best-selling products, handpicked for you!
          </p>
        </div>

        <div>
          <Slider {...settings}>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;
