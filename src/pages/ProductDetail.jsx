import React from "react";
import { useParams } from "react-router-dom";
import { products } from "../components/Products"; 

const ProductDetail = () => {
  const { id } = useParams(); 
  const product = products.find((p) => p.id.toString() === id);

  if (!product) {
    return <div className="p-8">Product not found.</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <img src={product.image} alt={product.name} className="w-full md:w-1/2 h-auto object-cover rounded-lg shadow" />
        <div>
          <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
          <p className="text-xl text-teal-600 mb-4">${product.price}</p>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <button className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
