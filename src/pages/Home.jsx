import React, { useState } from "react";
import { Link } from "react-router-dom";
import { products } from "../components/Products";
import webbanner from "../assets/banner.png";
import { useCart } from "../utils/CartContext";

const Home = () => {
  const [visibleCount, setVisibleCount] = useState(15);
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/*Hero*/}
      <section>
        <div
          className="relative w-full h-96 bg-cover bg-center"
          style={{
            backgroundImage: `url(${webbanner})`,
          }}
        >
          <div className="absolute inset-0 bg-opacity-50 flex flex-col items-center justify-center text-center text-white px-4">
            <h2 className="text-4xl font-bold">Biggest Sale of the Year</h2>
            <p className="mt-4 text-xl">Hurry, limited time only!</p>
            <Link
              to="/shop"
              className="mt-6 bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600 transition-all"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">
          Shop by Category
        </h2>{" "}
        <div className="flex justify-center gap-8 overflow-x-auto px-4">
          {[
            {
              name: "Electronics",
              image: "./src/assets/electronics.jpg",
              link: "/categories/electronics",
            },
            {
              name: "Fashion",
              image: "./src/assets/fashion.webp",
              link: "/categories/fashion",
            },
            {
              name: "Home",
              image: "./src/assets/home appliances.jpg",
              link: "/categories/home",
            },
            {
              name: "Fitness",
              image: "./src/assets/sports.jpg",
              link: "/categories/fitness",
            },
            {
              name: "Toys",
              image: "./src/assets/toys.jpg",
              link: "/categories/toys",
            },
            {
              name: "Accessories",
              image: "./src/assets/accessories.webp",
              link: "/categories/accessories",
            },
          ].map((category, index) => (
            <Link
              to={category.link}
              key={index}
              className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer w-53 flex-shrink-0 mb-2 mt-1"
            >
              <h3 className="font-semibold text-lg text-teal-500">
                {category.name}
              </h3>
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-40 object-cover mt-4 rounded-lg"
                loading="lazy"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products*/}
      <section className="py-16 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">
          Featured Products
        </h2>

        <div className="mr-15 ml-15 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {products.slice(0, visibleCount).map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-60 object-cover rounded-t-lg"
                />
              </Link>
              <div className="p-4">
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-gray-600 mt-2">
                  <span className={product.discountPrice ? "line-through" : ""}>
                    ${product.price.toFixed(2)}
                  </span>{" "}
                  {product.discountPrice && (
                    <span className="text-red-500 ml-2">
                      (${product.discountPrice.toFixed(2)})
                    </span>
                  )}
                </p>
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Prevent navigation to product page
                    addToCart(product, 1);
                    alert(`${product.name} added to cart!`);
                  }}
                  className="bg-orange-500 text-white py-1.5 px-6.5 rounded-full mt-3 hover:bg-orange-600 transition-all"
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
            className="mt-10 bg-zinc-950 text-white px-10 py-3 hover:bg-stale-950 transition-all"
          >
            View More
          </button>
        )}
      </section>

      {/* Flash Sale*/}
      <section className="py-24 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 relative overflow-hidden">
        
        <div className="absolute inset-0">
          
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-400 opacity-20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s", animationDuration: "8s" }}
          ></div>
          <div
            className="absolute top-3/4 left-2/3 w-40 h-40 bg-purple-400 opacity-30 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "2.5s", animationDuration: "5s" }}
          ></div>

          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBzdHJva2Utb3BhY2l0eT0iLjAyIiBzdHJva2U9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAyIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTAgMzBoMzB2MzBIMHoiIHN0cm9rZS1vcGFjaXR5PSIuMDIiIHN0cm9rZT0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDIiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMCAwaDMwdjMwSDB6IiBzdHJva2Utb3BhY2l0eT0iLjAyIiBzdHJva2U9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAyIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTMwIDBoMzB2MzBIMzB6IiBzdHJva2Utb3BhY2l0eT0iLjAyIiBzdHJva2U9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAyIiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        </div>

        <div className="relative container mx-auto px-6">
          {/* Header with animation */}
          <div className="text-center mb-16 relative">
            <div className="inline-flex items-center justify-center mb-5 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20">
              <span className="animate-ping absolute h-3 w-3 rounded-full bg-red-500 opacity-75"></span>
              <span className="relative rounded-full h-3 w-3 bg-red-600"></span>
              <p className="font-medium text-white ml-3 tracking-wider text-sm">
                LIVE NOW
              </p>
            </div>

            <h2 className="text-6xl font-black mb-6 text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-pink-200">
              ⚡ Flash Sale ⚡
            </h2>

            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="flex flex-col items-center bg-white/10 backdrop-blur-md p-3 rounded-xl min-w-[70px]">
                <span className="text-2xl font-bold text-white">24</span>
                <span className="text-xs text-white/70">HOURS</span>
              </div>
              <span className="text-white text-2xl font-bold">:</span>
              <div className="flex flex-col items-center bg-white/10 backdrop-blur-md p-3 rounded-xl min-w-[70px]">
                <span className="text-2xl font-bold text-white">45</span>
                <span className="text-xs text-white/70">MINUTES</span>
              </div>
              <span className="text-white text-2xl font-bold">:</span>
              <div className="flex flex-col items-center bg-white/10 backdrop-blur-md p-3 rounded-xl min-w-[70px]">
                <span className="text-2xl font-bold text-white">18</span>
                <span className="text-xs text-white/70">SECONDS</span>
              </div>
            </div>

            <p className="text-xl text-white/90 font-light max-w-xl mx-auto">
              Exclusive deals that won't last long! Get up to{" "}
              <span className="font-bold text-yellow-300">70% off</span> on premium
              products.
            </p>
          </div>

          {/* Cards with hover effects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Limited Edition",
                discount: "Up to 70% OFF",
                description: "Premium selections at unbeatable prices",
                badge: "BESTSELLER",
              },
              {
                title: "24HR Flash Deal",
                discount: "Buy 1 Get 1 Free",
                description: "New deals every day at midnight",
                badge: "HOT DEAL",
              },
              {
                title: "New Arrivals",
                discount: "First Access",
                description: "Be the first to grab new products",
                badge: "EXCLUSIVE",
              },
            ].map((deal, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-white/30 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] transition-all duration-500"
              >
                <div className="relative text-white space-y-4">
                  {deal.badge && (
                    <span className="absolute -top-3 -right-3 bg-yellow-500 text-black text-xs font-bold py-1 px-3 rounded-full">
                      {deal.badge}
                    </span>
                  )}

                  <h3 className="text-2xl font-bold group-hover:text-pink-200 transition-colors">
                    {deal.title}
                  </h3>

                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

                  <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-400">
                    {deal.discount}
                  </p>

                  <p className="text-white/70">{deal.description}</p>

                  <Link
                    to="/shop"
                    className="inline-block w-full bg-white/10 backdrop-blur text-white font-semibold py-3 px-6 rounded-xl border border-white/10 hover:bg-white hover:text-purple-800 transition-all duration-300 mt-4 text-center group-hover:shadow-glow"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="mt-20 text-center">
            <p className="text-xl font-medium text-white/80 mb-8">
              Time is running out! Don't miss these incredible offers
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center bg-white/10 backdrop-blur-lg text-white border border-white/20 px-10 py-4 rounded-full hover:bg-white hover:text-purple-800 transition-all duration-300 group"
            >
              <span className="font-semibold">View All Deals</span>
              <svg
                className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6">
        <p className="text-sm">&copy; 2025 Shopfinity - All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default Home;
