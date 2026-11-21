import React, { useState } from 'react';

function ProductCard({ product, onAdd }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    onAdd();
    setTimeout(() => setAdded(false), 800);
  };

  const stars = (r) => '★'.repeat(Math.floor(r)) + (r % 1 >= 0.5 ? '½' : '') + '☆'.repeat(5 - Math.ceil(r));

  return (
    <div className="product-card">
      <div className="product-image">
        <span className="product-emoji">{product.emoji || '📦'}</span>
        <button className="product-wishlist" onClick={(e) => { e.stopPropagation(); setWishlisted(!wishlisted); }}>
          {wishlisted ? '❤️' : '🤍'}
        </button>
        {product.stock > 0 && product.stock <= 15 && (
          <span className="product-badge">🔥 Few Left</span>
        )}
      </div>

      <div className="product-body">
        <span className="product-category-tag">{product.category}</span>
        <h3>{product.name}</h3>
        <p className="product-brand">by {product.brand}</p>
        <p className="product-desc">{product.description}</p>

        <div className="product-rating">
          <span className="stars">{stars(product.rating)}</span>
          <span className="rating-num">{product.rating}</span>
        </div>

        {product.features && (
          <div className="product-features">
            {product.features.map((f, i) => (
              <span key={i} className="feature-chip">✓ {f}</span>
            ))}
          </div>
        )}

        <div className="product-footer">
          <div className="product-price">
            <span className="price-amount">₹{product.price?.toLocaleString('en-IN')}</span>
            <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              <span className="stock-dot" />
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          <button
            className={`add-btn ${added ? 'added' : ''}`}
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            {added ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
