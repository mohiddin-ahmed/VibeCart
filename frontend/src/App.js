import React, { useState } from 'react';
import Home from './pages/Home';
import CartView from './components/CartView';
import './styles/App.css';

function App() {
  const [view, setView] = useState('home');
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const clearCart = () => setCartItems([]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo" onClick={() => setView('home')}>
            <div className="logo-icon">🛒</div>
            <h1>VibeCart</h1>
          </div>
          <div className="header-right">
            <span className="header-badge">AI Conversational Commerce</span>
            <nav className="header-nav">
              <button className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}>
                Shop
              </button>
              <button className={view === 'cart' ? 'active' : ''} onClick={() => setView('cart')}>
                Bag {cartItems.length > 0 && <span className="nav-badge">{cartItems.reduce((s, i) => s + i.quantity, 0)}</span>}
              </button>
            </nav>
          </div>
        </div>
      </header>
      
      <main>
        {view === 'home' && (
          <Home
            addToCart={addToCart}
            cartItems={cartItems}
            goToCart={() => setView('cart')}
          />
        )}
        {view === 'cart' && (
          <CartView
            items={cartItems}
            clearCart={clearCart}
            goShop={() => setView('home')}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Built with <span className="accent">Agora Conversational AI</span> + <span className="accent">Murf Falcon TTS</span></p>
        <p className="footer-sub">KNOTiC AI Accelerator Hub — Round 3</p>
      </footer>
    </div>
  );
}

export default App;
