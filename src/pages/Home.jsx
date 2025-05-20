import React, { useState } from "react";
import { Link } from "react-router-dom";
import { products } from "../components/Products";
import webbanner from "../assets/banner.png";


const Home = () => {
  const [visibleCount, setVisibleCount] = useState(15);

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
        <h2 className="text-3xl font-bold text-gray-800 mb-10">Shop by Category</h2>

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
              name: "Home Appliances",
              image: "./src/assets/home appliances.jpg",
              link: "/categories/home-appliances",
            },
            {
              name: "Accessories",
              image: "./src/assets/accessories.webp",
              link: "/categories/accessories",
            },
            {
              name: "Toys",
              image: "./src/assets/toys.jpg",
              link: "/categories/toys",
            },
            {
              name: "Sports",
              image: "./src/assets/sports.jpg",
              link: "/categories/sports",
            },
          ].map((category, index) => (
            <Link
              to={category.link}
              key={index}
              className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer w-53 flex-shrink-0 mb-2 mt-1"
            >
              <h3 className="font-semibold text-lg text-teal-500">{category.name}</h3>
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
        <h2 className="text-3xl font-bold text-gray-800 mb-10">Featured Products</h2>

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
                  </span>
                  {product.discountPrice && (
                    <span className="text-red-500 ml-2">(${product.discountPrice.toFixed(2)})</span>
                  )}
                </p>
                <button className="bg-orange-500 text-white py-1.5 px-6.5 rounded-full mt-3 hover:bg-orange-600 transition-all ">
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
      <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white opacity-10 rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold mb-6 text-white tracking-tight">
              ⚡ Flash Sale ⚡
            </h2>
            <p className="text-xl text-white/90 font-light">
              Exclusive deals that won't last long!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                title: "Limited Time Offers",
                discount: "Up to 70% OFF",
                description: "Premium selections at unbeatable prices"
              },
              {
                title: "Flash Discount",
                discount: "24HR Deal",
                description: "New deals every day at midnight"
              },
              {
                title: "New Arrivals",
                discount: "First Access",
                description: "Be the first to grab new products"
              }
            ].map((deal, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="text-white space-y-4">
                  <h3 className="text-2xl font-bold">{deal.title}</h3>
                  <p className="text-3xl font-extrabold text-yellow-300">
                    {deal.discount}
                  </p>
                  <p className="text-white/80">{deal.description}</p>
                  <Link
                    to="/shop"
                    className="inline-block w-full bg-white text-purple-600 font-semibold py-3 px-6 rounded-xl hover:bg-opacity-90 transition-colors mt-4 text-center"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-xl font-medium text-white/90 mb-6">
              Time is running out! Don't miss these incredible offers
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center bg-white/10 backdrop-blur-lg text-white border border-white/20 px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 group"
            >
              <span className="font-semibold">View All Deals</span>
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
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
