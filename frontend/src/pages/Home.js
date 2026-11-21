import React, { useState, useMemo } from 'react';
import VoiceAgent from '../components/VoiceAgent';
import ProductCard from '../components/ProductCard';
import demoProducts from '../data/products';

const categories = ['All', 'Electronics', 'Smartphones', 'Laptops', 'Footwear', 'Clothing'];

function Home({ addToCart }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [toast, setToast] = useState('');

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
    setToast(`✅ ${product.name} added to cart!`);
    setTimeout(() => setToast(''), 2500);
  };

  // Connects Voice Assistant speech actions directly to UI state
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
    }
  };

  return (
    <div className="home">
      <VoiceAgent onVoiceAction={handleVoiceAction} />

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

      <div className="section-header">
        <h3>{activeCategory === 'All' ? '✨ All Products' : `📂 ${activeCategory}`}</h3>
        <span>{filtered.length} items found</span>
      </div>

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

      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </div>
  );
}

export default Home;
