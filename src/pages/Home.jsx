import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { products } from "../components/Products";
import webbanner from "../assets/banner.png";
import { useCart } from "../utils/CartContext";

const Home = () => {
  const [visibleCount, setVisibleCount] = useState(15);
  const { addToCart } = useCart();

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
        <div className="flex justify-start sm:justify-center gap-4 sm:gap-8 overflow-x-auto px-4 py-2 pb-4 scrollbar-hide">
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
              className="bg-white rounded-lg shadow-md p-4 sm:p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer w-40 sm:w-53 flex-shrink-0 mb-2 mt-1"
            >
              <h3 className="font-semibold text-base sm:text-lg text-teal-500">
                {category.name}
              </h3>
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-32 sm:h-40 object-cover mt-4 rounded-lg"
                loading="lazy"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products*/}
      <section className="py-8 sm:py-16 px-4 sm:px-6 bg-white text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-10">
          Featured Products
        </h2>

        <div className="mr-4 ml-4 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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

      {/* Deal of the Day */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-10">
            Deal of the Day
          </h2>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2">
                <img
                  src="./src/assets/electronics.jpg"
                  alt="Deal of the Day"
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-center">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">
                  Special Offer Today!
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6">
                  Get up to 50% off on selected electronics items. Limited time
                  offer!
                </p>
                <div className="flex flex-wrap gap-3 mb-4 sm:mb-6">
                  <div className="bg-gray-100 rounded-lg p-3 text-center flex-1">
                    <span className="block text-xl sm:text-2xl font-bold">
                      00
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500">
                      Days
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 text-center flex-1">
                    <span className="block text-xl sm:text-2xl font-bold">
                      12
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500">
                      Hours
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 text-center flex-1">
                    <span className="block text-xl sm:text-2xl font-bold">
                      30
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500">
                      Minutes
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 text-center flex-1">
                    <span className="block text-xl sm:text-2xl font-bold">
                      45
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500">
                      Seconds
                    </span>
                  </div>
                </div>
                <Link
                  to="/categories/electronics"
                  className="bg-teal-500 text-white text-center py-2 px-6 rounded-full hover:bg-teal-600 transition-all inline-block"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-gray-600 mb-6">
            Get updates on sales, special offers and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-teal-500"
            />
            <button className="bg-teal-500 text-white px-6 py-3 rounded-full hover:bg-teal-600 transition-all">
              Subscribe
            </button>
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
