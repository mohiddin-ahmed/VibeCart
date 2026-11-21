import React, { useState, useMemo } from 'react';
import VoiceAgent from '../components/VoiceAgent';
import ProductCard from '../components/ProductCard';
import demoProducts from '../data/products';

const categories = ['All', 'Electronics', 'Smartphones', 'Laptops', 'Footwear', 'Clothing'];

function Home({ addToCart, cartItems = [], goToCart }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [toast, setToast] = useState('');

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const filtered = useMemo(() => {
    let list = demoProducts;
    if (activeCategory !== 'All') {
      list = list.filter(p => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.features.some(f => f.toLowerCase().includes(q))
      );
    }
    return list;
  }, [search, activeCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveCategory('All');
  };

  const handleAdd = (product) => {
    addToCart(product);
    setToast(`✅ ${product.name} added to shopping bag!`);
    setTimeout(() => setToast(''), 2500);
  };

  // Connects Voice Assistant speech actions directly to UI state & navigation
  const handleVoiceAction = (action, payload) => {
    if (action === 'add') {
      const found = demoProducts.find(p => p.name.toLowerCase().includes(payload.toLowerCase()));
      if (found) {
        handleAdd(found);
      }
    } else if (action === 'category') {
      setActiveCategory(payload);
      setSearch('');
    } else if (action === 'search') {
      setActiveCategory('All');
      setSearch(payload);
    } else if (action === 'view_cart' || action === 'checkout') {
      if (goToCart) goToCart();
    }
  };

  return (
    <div className="home">
      <VoiceAgent onVoiceAction={handleVoiceAction} cartCount={cartItemCount} />

      {/* 3-Step Clear Onboarding Flow (Makes shopping vision crystal clear) */}
      <div className="onboarding-guide-card">
        <div className="guide-header">
          <span className="guide-sparkle">✨</span>
          <h4>How Continuous Voice Shopping Works</h4>
        </div>
        <div className="guide-steps">
          <div className="guide-step">
            <span className="step-num">1</span>
            <div className="step-content">
              <strong>🎙️ Talk & Search</strong>
              <p>Say "Laptops under 1 lakh" or "Sony vs boAt"</p>
            </div>
          </div>
          <div className="guide-arrow">➔</div>
          <div className="guide-step">
            <span className="step-num">2</span>
            <div className="step-content">
              <strong>🛍️ Add Multiple Items</strong>
              <p>Say "Add boAt to cart" (keep speaking for more!)</p>
            </div>
          </div>
          <div className="guide-arrow">➔</div>
          <div className="guide-step">
            <span className="step-num">3</span>
            <div className="step-content">
              <strong>💳 Voice Checkout</strong>
              <p>Say "Checkout" anytime or tap Bag to finish</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <section className="search-section">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="🔍  Search products... headphones, laptop, shoes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="clear-btn"
              onClick={() => setSearch('')}
              style={{ background: 'transparent', border: 'none', color: '#999', cursor: 'pointer', paddingRight: '8px' }}
            >
              ✕
            </button>
          )}
          <button type="submit">Search</button>
        </form>
      </section>

      {/* Category Tabs */}
      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => { setActiveCategory(cat); setSearch(''); }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Section Header */}
      <div className="section-header">
        <h3>{activeCategory === 'All' ? '✨ Featured Products' : `📂 ${activeCategory}`}</h3>
        <span>{filtered.length} items available</span>
      </div>

      {/* Flowing Product Grid */}
      {filtered.length === 0 ? (
        <div className="no-results">
          <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔍</p>
          <p>No products match your search.</p>
          <button
            className="shop-btn"
            style={{ marginTop: '1rem' }}
            onClick={() => { setSearch(''); setActiveCategory('All'); }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <section className="products-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={() => handleAdd(product)} />
          ))}
        </section>
      )}

      {/* Floating Bottom Cart Review Pill (When user has added items) */}
      {cartItemCount > 0 && (
        <div className="floating-cart-pill" onClick={goToCart}>
          <div className="floating-cart-info">
            <span className="cart-orb-icon">🛍️</span>
            <div>
              <div className="floating-cart-title">{cartItemCount} item{cartItemCount > 1 ? 's' : ''} in Bag • ₹{cartTotal.toLocaleString('en-IN')}</div>
              <div className="floating-cart-sub">🗣️ Say "Checkout" anytime or tap to review & place order</div>
            </div>
          </div>
          <button className="floating-checkout-btn">
            Checkout →
          </button>
        </div>
      )}

      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </div>
  );
}

export default Home;
