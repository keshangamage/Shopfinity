import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { products } from '../components/Products';
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
    const query = queryParams.get('q');
    
    if (query) {
      // Filter products based on search query
      const results = products.filter(product => 
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
  const searchQuery = new URLSearchParams(location.search).get('q') || '';

  return (
    <div className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Search Results for "{searchQuery}"</h1>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : noResults ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold mb-2">No products found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any products matching "{searchQuery}"
            </p>
            <Link to="/" className="text-teal-600 hover:text-teal-800 font-medium">
              Browse our catalog instead
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-8">Found {searchResults.length} products</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="aspect-square overflow-hidden rounded-t-lg">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-60 object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                        }}
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <p className="text-gray-600 my-2">
                      <span className={product.discountPrice ? "line-through text-gray-400" : ""}>
                        ${product.price.toFixed(2)}
                      </span>
                      {product.discountPrice && (
                        <span className="text-red-500 ml-2">
                          ${product.discountPrice.toFixed(2)}
                        </span>
                      )}
                    </p>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                        {product.category}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product, 1);
                          alert(`${product.name} added to cart!`);
                        }}
                        className="bg-teal-500 text-white py-1 px-4 rounded-full text-sm hover:bg-teal-600 transition-all"
                      >
                        Add to Cart
                      </button>
                    </div>
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
