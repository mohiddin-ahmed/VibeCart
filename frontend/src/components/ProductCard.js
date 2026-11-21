import React, { useState } from 'react';
import axios from 'axios';

const API = '/api';

const categoryEmojis = {
  'Electronics': '🎧',
  'Smartphones': '📱',
  'Laptops': '💻',
  'Footwear': '👟',
  'Clothing': '👕',
};

function ProductCard({ product, onAdded }) {
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const addToCart = async () => {
    setAdding(true);
    try {
      await axios.post(`${API}/cart/add`, {
        userId: 'demo-user',
        productId: product._id,
        quantity: 1,
      });
      if (onAdded) onAdded(product.name);
    } catch (err) {
      console.error('Failed to add to cart');
    }
    setTimeout(() => setAdding(false), 600);
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
  };

  const emoji = categoryEmojis[product.category] || '📦';

  return (
    <div className="product-card">
      <div className="product-image">
        {emoji}
        <button className="product-wishlist" onClick={() => setWishlisted(!wishlisted)}>
          {wishlisted ? '❤️' : '🤍'}
        </button>
        {product.stock > 0 && product.stock <= 10 && (
          <span className="product-badge">Few Left</span>
        )}
      </div>

      <div className="product-body">
        <span className="product-category-tag">{product.category}</span>
        <h3>{product.name}</h3>
        <p className="product-brand">{product.brand}</p>

        <div className="product-rating">
          <span className="stars">{renderStars(product.rating)}</span>
          <span className="rating-num">{product.rating}</span>
        </div>

        {product.features && product.features.length > 0 && (
          <div className="product-features">
            {product.features.slice(0, 3).map((f, i) => (
              <span key={i} className="feature-chip">{f}</span>
            ))}
          </div>
        )}

        <div className="product-footer">
          <div className="product-price">
            <span className="price-amount">₹{product.price?.toLocaleString('en-IN')}</span>
            <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              <span className="stock-dot" />
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          <button className="add-btn" onClick={addToCart} disabled={product.stock === 0 || adding}>
            {adding ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
