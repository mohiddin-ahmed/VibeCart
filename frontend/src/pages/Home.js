import React, { useState, useMemo } from 'react';
import VoiceAgent from '../components/VoiceAgent';
import ProductCard from '../components/ProductCard';
import demoProducts from '../data/products';

const categories = ['All', 'Electronics', 'Smartphones', 'Laptops', 'Footwear', 'Clothing'];

// Helper to clean search phrases like "liked to buy headphones" -> "headphones"
function cleanSearchQuery(raw) {
  if (!raw) return '';
  const stopWords = ['liked', 'like', 'to', 'buy', 'want', 'need', 'have', 'show', 'find', 'me', 'for', 'i', 'can', 'get', 'a', 'an', 'the', 'please', 'give', 'looking', 'some'];
  const words = raw.toLowerCase().trim().split(/\s+/).filter(w => !stopWords.includes(w));
  return words.join(' ');
}

function Home({ addToCart, cartItems = [], goToCart }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [toast, setToast] = useState('');

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Smart multi-keyword fuzzy filtering
  const filtered = useMemo(() => {
    let list = demoProducts;
    if (activeCategory !== 'All') {
      list = list.filter(p => p.category === activeCategory);
    }

    if (search.trim()) {
      const cleaned = cleanSearchQuery(search);
      const queryWords = cleaned.split(/\s+/).filter(Boolean);

      // If cleaning removed everything, fallback to raw search
      const terms = queryWords.length > 0 ? queryWords : search.toLowerCase().trim().split(/\s+/);

      list = list.filter(p => {
        const pName = p.name.toLowerCase();
        const pDesc = p.description.toLowerCase();
        const pBrand = p.brand.toLowerCase();
        const pCat = p.category.toLowerCase();
        const pFeat = p.features.map(f => f.toLowerCase()).join(' ');

        // Check if ANY term matches
        return terms.some(term =>
          pName.includes(term) ||
          pDesc.includes(term) ||
          pBrand.includes(term) ||
          pCat.includes(term) ||
          pFeat.includes(term) ||
          (term.includes('headphone') && pCat === 'electronics') ||
          (term.includes('phone') && pCat === 'smartphones') ||
          (term.includes('laptop') && pCat === 'laptops') ||
          (term.includes('shoe') && pCat === 'footwear') ||
          (term.includes('sneaker') && pCat === 'footwear') ||
          (term.includes('cloth') && pCat === 'clothing') ||
          (term.includes('jean') && pCat === 'clothing')
        );
      });
    }
    return list;
  }, [search, activeCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveCategory('All');
  };

  const handleAdd = (product, autoCheckout = false) => {
    addToCart(product);
    setToast(`✅ ${product.name} added to bag!`);
    setTimeout(() => setToast(''), 2500);

    if (autoCheckout && goToCart) {
      setTimeout(() => {
        goToCart();
      }, 600);
    }
  };

  // Connects Voice Assistant speech actions directly to UI state & navigation
  const handleVoiceAction = (action, payload) => {
    if (action === 'add') {
      const found = demoProducts.find(p => p.name.toLowerCase().includes(payload.toLowerCase()));
      if (found) {
        handleAdd(found, false);
      }
    } else if (action === 'buy_direct') {
      const found = demoProducts.find(p => p.name.toLowerCase().includes(payload.toLowerCase()));
      if (found) {
        handleAdd(found, true);
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

      {/* 3-Step Clear Onboarding Flow */}
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
              <p>Say "I want headphones" or "Laptops under 1 lakh"</p>
            </div>
          </div>
          <div className="guide-arrow">➔</div>
          <div className="guide-step">
            <span className="step-num">2</span>
            <div className="step-content">
              <strong>🛍️ Choose & Add</strong>
              <p>AI asks which one you prefer & adds it instantly</p>
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
            <ProductCard key={product.id} product={product} onAdd={() => handleAdd(product, false)} />
          ))}
        </section>
      )}

      {/* Floating Bottom Cart Review Pill (Only when items exist) */}
      {cartItemCount > 0 && (
        <div className="floating-cart-pill" onClick={goToCart}>
          <div className="floating-cart-info">
            <span className="cart-orb-icon">🛍️</span>
            <div>
              <div className="floating-cart-title">{cartItemCount} item{cartItemCount > 1 ? 's' : ''} in Bag • ₹{cartTotal.toLocaleString('en-IN')}</div>
              <div className="floating-cart-sub">🗣️ Say "Checkout" anytime or tap to place order</div>
            </div>
          </div>
          <button className="floating-checkout-btn">
            Checkout →
          </button>
        </div>
      )}

      {/* Toast Notification - ONLY renders if toast has text so no empty border appears! */}
      {toast && <div className="toast show">{toast}</div>}
    </div>
  );
}

export default Home;
