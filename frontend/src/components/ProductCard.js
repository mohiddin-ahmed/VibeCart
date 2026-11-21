import React, { useState } from 'react';

function ProductCard({ product, onAdd }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    onAdd();
    setTimeout(() => setAdded(false), 900);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-card">
      <div className="product-image-container">
        {!imageLoaded && <div className="image-skeleton" />}
        <img
          src={product.image}
          alt={product.name}
          className={`product-photo ${imageLoaded ? 'loaded' : ''}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Badges */}
        <div className="card-badge-row">
          {product.badge && <span className="product-badge">{product.badge}</span>}
          {discountPercent > 0 && (
            <span className="discount-tag">-{discountPercent}%</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className={`product-wishlist ${wishlisted ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); setWishlisted(!wishlisted); }}
          title={wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
        >
          {wishlisted ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="product-body">
        <div className="brand-category-row">
          <span className="product-brand">{product.brand}</span>
          <span className="product-category-tag">{product.category}</span>
        </div>

        <h3 title={product.name}>{product.name}</h3>
        <p className="product-desc">{product.description}</p>

        {/* Rating and Reviews */}
        <div className="product-rating">
          <span className="star-icon">★</span>
          <span className="rating-score">{product.rating}</span>
          {product.reviewsCount && (
            <span className="reviews-count">({product.reviewsCount.toLocaleString()})</span>
          )}
        </div>

        {/* Features Chips */}
        {product.features && (
          <div className="product-features">
            {product.features.slice(0, 3).map((f, i) => (
              <span key={i} className="feature-chip">✓ {f}</span>
            ))}
          </div>
        )}

        {/* Price & Action */}
        <div className="product-footer">
          <div className="product-price">
            <div className="price-row">
              <span className="price-amount">₹{product.price?.toLocaleString('en-IN')}</span>
              {product.originalPrice && (
                <span className="original-price">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
              )}
            </div>
            <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              <span className="stock-dot" />
              {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
            </span>
          </div>
          
          <button
            className={`add-btn ${added ? 'added' : ''}`}
            onClick={handleAdd}
            disabled={product.stock === 0}
            title="Add to cart"
          >
            {added ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
