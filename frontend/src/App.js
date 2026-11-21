import React, { useState } from 'react';
import Home from './pages/Home';
import CartView from './components/CartView';

function App() {
  const [view, setView] = useState('home');

  return (
    <div className="app">
      <header className="app-header">
        <h1 onClick={() => setView('home')}>🛒 VibeCart</h1>
        <p className="tagline">AI Voice Shopping Assistant</p>
        <nav>
          <button className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}>Home</button>
          <button className={view === 'cart' ? 'active' : ''} onClick={() => setView('cart')}>Cart</button>
        </nav>
      </header>
      <main>
        {view === 'home' && <Home />}
        {view === 'cart' && <CartView userId="demo-user" />}
      </main>
    </div>
  );
}

export default App;
