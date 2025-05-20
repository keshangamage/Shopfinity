import { useParams } from "react-router-dom";
import { products } from "../components/Products";
import React from "react";
import { Link } from "react-router-dom";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const categoryProducts = products.filter(
    (item) => item.category.toLowerCase() === categoryName.toLowerCase()
  );

  return (
    <div className="py-16 px-6 bg-white text-center">
      <h1 className="text-3xl font-bold mb-10 capitalize ml-15">{categoryName}</h1>
      {categoryProducts.length > 0 ? (
        <div className="mr-15 ml-15 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {categoryProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Link to={`/product/${product.id}`}>
                <img
                  src={`/${product.image}`}
                  alt={product.name}
                  className="w-full h-60 object-cover rounded-t-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                  }}
                />
              </Link>
              <div className="p-4">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-600 mt-2">${product.price.toFixed(2)}</p>
                <button className="bg-orange-500 text-white py-1.5 px-6.5 rounded-full mt-3 hover:bg-orange-600 transition-all ">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found in this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;
