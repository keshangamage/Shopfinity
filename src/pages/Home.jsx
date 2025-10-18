import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import webbanner from "../assets/banner.png";
import { useCart } from "../utils/CartContext";
import { useProducts } from "../utils/ProductContext";
import { resolveProductImage } from "../utils/assetResolver.js";

const featuredCategories = [
  {
    name: "Electronics",
    image: resolveProductImage("electronics.jpg"),
    link: "/categories/electronics",
  },
  {
    name: "Fashion",
    image: resolveProductImage("fashion.webp"),
    link: "/categories/fashion",
  },
  {
    name: "Home",
    image: resolveProductImage("home appliances.jpg"),
    link: "/categories/home",
  },
  {
    name: "Fitness",
    image: resolveProductImage("sports.jpg"),
    link: "/categories/fitness",
  },
  {
    name: "Toys",
    image: resolveProductImage("toys.jpg"),
    link: "/categories/toys",
  },
  {
    name: "Accessories",
    image: resolveProductImage("accessories.webp"),
    link: "/categories/accessories",
  },
];

const Home = () => {
  const [visibleCount, setVisibleCount] = useState(20);
  const { addToCart } = useCart();
  const { products } = useProducts();

  // Trending products array
  const trendingProducts = [
    products.find((p) => p.name.includes("Fitness Tracker Pro")),
    products.find((p) => p.name.includes("Smart Watch")),
    products.find((p) => p.name.includes("Wireless Earbuds")),
    products.find((p) => p.name.includes("Designer Watch")),
    products.find((p) => p.name.includes("Bluetooth Speaker")),
    products.find((p) => p.name.includes("Leather Jacket")),
    products.find((p) => p.name.includes("Air Fryer")),
    products.find((p) => p.name.includes("Smartphone")),
    products.find((p) => p.name.includes("LED")),
    products.find((p) => p.name.includes("Coffee Maker")),
    products.find((p) => p.name.includes("Laptop")),
    products.find((p) => p.name.includes("Headphones")),
  ].filter(Boolean);

  // Save scroll position
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem("scrollPosition", window.pageYOffset);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    const scrollPosition = sessionStorage.getItem("scrollPosition");
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition));
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Hero */}
      <section>
        <div
          className="relative w-full h-64 sm:h-80 md:h-96 bg-cover bg-center"
          style={{
            backgroundImage: `url(${webbanner})`,
          }}
        >
          <div className="absolute inset-0 bg-opacity-50 flex flex-col items-center justify-center text-center text-white px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Biggest Sale of the Year
            </h2>
            <p className="mt-2 sm:mt-4 text-base sm:text-xl">
              Hurry, limited time only!
            </p>
            <Link
              to="/categories/electronics"
              className="mt-4 sm:mt-6 bg-teal-500 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-teal-600 transition-all"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-8 sm:py-12 bg-gray-50 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-10 px-4">
          Shop by Category
        </h2>
        <div className="flex flex-nowrap justify-start sm:justify-center gap-4 sm:gap-6 overflow-x-auto px-4 py-2 pb-6 scrollbar-hide max-w-full min-h-[220px] sm:min-h-[240px]">
          {featuredCategories.map((category, index) => (
            <Link
              to={category.link}
              key={index}
              className="bg-white rounded-lg shadow-md p-3 sm:p-4 transform hover:scale-105 transition-all duration-300 cursor-pointer w-44 sm:w-52 flex-shrink-0 mb-2 mt-1 block"
            >
              <h3 className="font-semibold text-base sm:text-lg text-teal-500 mb-3">
                {category.name}
              </h3>
              <div className="aspect-square w-full">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover rounded-lg"
                  style={{ aspectRatio: "1/1", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products*/}
      <section className="py-8 sm:py-16 px-4 sm:px-6 bg-white text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-10">
          Featured Products
        </h2>

        <div className="mr-4 ml-4 grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.slice(0, visibleCount).map((product) => (
            <div
              key={product.id}
              className="product-card bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="product-image-container">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/300x300?text=Image+Not+Found";
                    }}
                  />
                  {product.discountPrice && (
                    <div className="sale-badge">SALE</div>
                  )}
                </Link>
              </div>
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="product-title hover:text-teal-600">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    {product.discountPrice ? (
                      <>
                        <span className="product-price">
                          ${product.discountPrice.toFixed(2)}
                        </span>
                        <span className="product-price-original">
                          ${product.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="product-price">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="product-rating">★★★★☆</div>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product, 1);
                    alert(`${product.name} added to cart!`);
                  }}
                  className="add-to-cart-button"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {visibleCount < products.length && (
          <button
            onClick={() => setVisibleCount((prev) => prev + 15)}
            className="mt-8 sm:mt-12 bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600 transition-all"
          >
            Load More Products
          </button>
        )}
      </section>

      {/* Trending Now */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 bg-gradient-to-r from-teal-500/10 to-blue-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Trending Now
            </h2>
            <Link
              to="/categories/accessories"
              className="text-teal-600 hover:text-teal-800 font-medium flex items-center"
            >
              View All
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
            {trendingProducts.map((product) => (
              <div
                key={product.id}
                className="flex-none w-64 sm:w-72 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <Link to={`/product/${product.id}`} className="block relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/300x300?text=Image+Not+Found";
                    }}
                  />
                  {product.discountPrice && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                      {Math.round(
                        ((product.price - product.discountPrice) /
                          product.price) *
                          100
                      )}
                      % OFF
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white bg-opacity-90 px-4 py-2 rounded-full">
                      <span className="text-teal-600 font-medium">
                        View Details
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 mb-2 truncate">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <div>
                      {product.discountPrice ? (
                        <div className="flex flex-col">
                          <span className="text-teal-600 font-bold">
                            ${product.discountPrice.toFixed(2)}
                          </span>
                          <span className="text-gray-400 line-through text-sm">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-teal-600 font-bold">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product, 1);
                        alert(`${product.name} added to cart!`);
                      }}
                      className="text-teal-600 hover:bg-teal-50 p-2 rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3 sm:mb-4">Shop</h3>
            <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
              <li>
                <Link to="/categories/electronics" className="hover:text-white">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/categories/fashion" className="hover:text-white">
                  Fashion
                </Link>
              </li>
              <li>
                <Link to="/categories/fitness" className="hover:text-white">
                  Fitness
                </Link>
              </li>
              <li>
                <Link to="/categories/home" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories/accessories" className="hover:text-white">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 sm:mb-4">Account</h3>
            <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
              <li>
                <Link to="/profile" className="hover:text-white">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white">
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 sm:mb-4">Information</h3>
            <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
              <li>
                <a href="#" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 sm:mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
              <li>123 Shopping St, City</li>
              <li>Email: info@shopfinity.com</li>
              <li>Phone: +1 234 567 8901</li>
            </ul>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="hover:text-teal-300">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="hover:text-teal-300">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="hover:text-teal-300">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="hover:text-teal-300">
                <i className="fab fa-pinterest"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Shopfinity. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
