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

  return (
    <div className="home">
      <VoiceAgent />

      <section className="search-section">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="🔍  Search products... headphones, laptop, shoes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
        <span>{filtered.length} items</span>
      </div>

      {filtered.length === 0 ? (
        <div className="no-results">
          <p style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🔍</p>
          <p>No products found. Try a different search.</p>
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
