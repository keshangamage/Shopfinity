import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { products } from "../components/Products";
import { useCart } from "../utils/CartContext";

const SearchPage = () => {
  const location = useLocation();
  const { addToCart } = useCart();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);

  // Get search query from URL
  useEffect(() => {
    setLoading(true);
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("q");

    if (query) {
      // Filter products based on search query
      const results = products.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(results);
      setNoResults(results.length === 0);
    } else {
      setSearchResults([]);
      setNoResults(true);
    }

    setLoading(false);
  }, [location.search]);

  // Display
  const searchQuery = new URLSearchParams(location.search).get("q") || "";

  return (
    <div className="py-8 sm:py-16 px-4 sm:px-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          Search Results for "{searchQuery}"
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : noResults ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No products found
            </h2>
            <p className="text-gray-500 mb-6">
              We couldn't find any products matching your search.
            </p>
            <Link
              to="/"
              className="bg-teal-500 text-white py-2 px-6 rounded-md hover:bg-teal-600 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-8 text-gray-600">
              {searchResults.length}{" "}
              {searchResults.length === 1 ? "product" : "products"} found
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {searchResults.map((product) => (
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
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
