import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VoiceAgent from '../components/VoiceAgent';
import ProductCard from '../components/ProductCard';

const API = '/api';

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (query) => {
    setLoading(true);
    try {
      const url = query ? `${API}/products/search?q=${query}` : `${API}/products`;
      const res = await axios.get(url);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(search);
  };

  return (
    <div className="home">
      <VoiceAgent />

      <section className="search-section">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products... (e.g., headphones, laptop)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">🔍 Search</button>
        </form>
      </section>

      <section className="products-grid">
        {loading && <p>Loading products...</p>}
        {!loading && products.length === 0 && <p>No products found.</p>}
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </section>
    </div>
  );
}

export default Home;
