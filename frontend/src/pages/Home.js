import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VoiceAgent from '../components/VoiceAgent';
import ProductCard from '../components/ProductCard';

const API = '/api';

const categories = ['All', 'Electronics', 'Smartphones', 'Laptops', 'Footwear', 'Clothing'];

function Home({ onCartUpdate }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [toast, setToast] = useState('');

  const fetchProducts = async (query, category) => {
    setLoading(true);
    try {
      let url = `${API}/products`;
      const params = new URLSearchParams();
      if (query) {
        url = `${API}/products/search`;
        params.set('q', query);
      }
      if (category && category !== 'All') params.set('category', category);
      const fullUrl = params.toString() ? `${url}?${params}` : url;
      const res = await axios.get(fullUrl);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts('', activeCategory); }, [activeCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveCategory('All');
    fetchProducts(search);
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    setSearch('');
  };

  const showToast = (name) => {
    setToast(`✅ ${name} added to cart!`);
    if (onCartUpdate) onCartUpdate(prev => (typeof prev === 'number' ? prev + 1 : 1));
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="home">
      <VoiceAgent />

      <section className="search-section">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products... headphones, laptop, shoes"
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
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="section-header">
        <h3>{activeCategory === 'All' ? 'All Products' : activeCategory}</h3>
        <span>{products.length} items</span>
      </div>

      {loading ? (
        <div className="loading">
          <div className="loading-spinner" />
          <p>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="no-results">
          <p>No products found. Try a different search or category.</p>
        </div>
      ) : (
        <section className="products-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} onAdded={showToast} />
          ))}
        </section>
      )}

      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </div>
  );
}

export default Home;
