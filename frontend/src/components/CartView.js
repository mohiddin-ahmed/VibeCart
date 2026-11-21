import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = '/api';

function CartView({ userId }) {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API}/cart/${userId}`);
      setCart(res.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchCart(); }, [userId]);

  const handleCheckout = async () => {
    try {
      const res = await axios.post(`${API}/cart/checkout`, { userId });
      alert(`🎉 Order placed! Order ID: ${res.data.order._id}`);
      fetchCart();
    } catch (err) {
      alert('Checkout failed: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="cart-view">
      <div className="cart-header">
        <h2>Your Cart</h2>
        {cart.items.length > 0 && (
          <span className="cart-count">{cart.items.length} items</span>
        )}
      </div>

      {cart.items.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <p>Your cart is empty.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>Try voice shopping — tap the orb on the home page!</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.items.map((item, i) => (
              <div key={i} className="cart-item">
                <div className="cart-item-image">📦</div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.product?.name || 'Product'}</div>
                  <div className="cart-item-qty">Qty: {item.quantity}</div>
                </div>
                <div className="cart-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-row">
              <span>Subtotal</span>
              <span>₹{cart.totalAmount?.toLocaleString('en-IN')}</span>
            </div>
            <div className="cart-row">
              <span>Delivery</span>
              <span style={{ color: '#34d399' }}>Free</span>
            </div>
            <div className="cart-row total">
              <span>Total</span>
              <span>₹{cart.totalAmount?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            Checkout — ₹{cart.totalAmount?.toLocaleString('en-IN')}
          </button>
        </>
      )}
    </div>
  );
}

export default CartView;
