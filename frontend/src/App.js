import React, { useState } from 'react';
import Home from './pages/Home';
import CartView from './components/CartView';
import './styles/App.css';

function App() {
  const [view, setView] = useState('home');
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo" onClick={() => setView('home')}>
            <div className="logo-icon">🛒</div>
            <h1>VibeCart</h1>
          </div>
          <nav className="header-nav">
            <button className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}>
              🏠 Shop
            </button>
            <button className={view === 'cart' ? 'active' : ''} onClick={() => setView('cart')}>
              🛒 Cart{cartCount > 0 ? ` (${cartCount})` : ''}
            </button>
          </nav>
        </div>
      </header>
      <main>
        {view === 'home' && <Home onCartUpdate={setCartCount} />}
        {view === 'cart' && <CartView userId="demo-user" />}
      </main>
    </div>
  );
}

export default App;
