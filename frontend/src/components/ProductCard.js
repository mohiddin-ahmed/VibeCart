import React from 'react';
import axios from 'axios';

const API = '/api';

function ProductCard({ product }) {
  const addToCart = async () => {
    try {
      await axios.post(`${API}/cart/add`, {
        userId: 'demo-user',
        productId: product._id,
        quantity: 1,
      });
      alert(`${product.name} added to cart!`);
    } catch (err) {
      alert('Failed to add to cart');
    }
  };

  return (
    <div className="product-card">
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="brand">{product.brand}</p>
        <p className="description">{product.description}</p>
        <div className="product-meta">
          <span className="price">₹{product.price?.toLocaleString('en-IN')}</span>
          <span className="rating">⭐ {product.rating}</span>
          <span className={`stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
        {product.features && (
          <div className="features">
            {product.features.map((f, i) => <span key={i} className="feature-tag">{f}</span>)}
          </div>
        )}
      </div>
      <button className="add-to-cart" onClick={addToCart} disabled={product.stock === 0}>
        🛒 Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
