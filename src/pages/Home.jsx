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
          className="relative w-full h-96 bg-cover bg-center"
          style={{
            backgroundImage: `url(${webbanner})`,
          }}
        >
          <div className="absolute inset-0 bg-opacity-50 flex flex-col items-center justify-center text-center text-white px-4">
            <h2 className="text-4xl font-bold">Biggest Sale of the Year</h2>
            <p className="mt-4 text-xl">Hurry, limited time only!</p>
            <Link
              to="/categories/electronics"
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

      <section className="py-12 bg-orange-500 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">⚡ Flash Sale</h2>
            <p className="text-lg mb-4">Limited time offers - Up to 70% off</p>

            <div className="inline-block bg-white text-orange-600 font-bold px-6 py-2 rounded mb-4">
              24:45:18 remaining
            </div>
          </div>

          {/* cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Limited Edition",
                discount: "70% OFF",
                description: "Premium selections at unbeatable prices",
                badge: "BESTSELLER",
              },
              {
                title: "24HR Flash Deal",
                discount: "BUY 1 GET 1",
                description: "New deals every day at midnight",
                badge: "HOT DEAL",
              },
              {
                title: "New Arrivals",
                discount: "EXCLUSIVE",
                description: "Be the first to grab new products",
                badge: "NEW",
              },
            ].map((deal, index) => (
              <div
                key={index}
                className="bg-white text-gray-800 rounded shadow-md"
              >
                <div className="p-6 relative">
                  {deal.badge && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold py-1 px-2 rounded">
                      {deal.badge}
                    </div>
                  )}

                  <h3 className="text-xl font-bold mb-2">{deal.title}</h3>

                  <p className="text-2xl font-bold text-orange-500 mb-2">
                    {deal.discount}
                  </p>

                  <p className="text-gray-600 mb-4">{deal.description}</p>

                  <Link
                    to="/categories/home"
                    className="block bg-orange-500 text-white text-center py-2 rounded hover:bg-orange-600"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <Link
              to="/categories/toys"
              className="inline-block bg-white text-orange-500 font-medium px-6 py-2 rounded hover:bg-gray-100"
            >
              View All Deals
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
