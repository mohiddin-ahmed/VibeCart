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
      alert(`Order placed! Order ID: ${res.data.order._id}`);
      fetchCart();
    } catch (err) {
      alert('Checkout failed: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <p>Loading cart...</p>;

  return (
    <div className="cart-view">
      <h2>🛒 Your Cart</h2>
      {cart.items.length === 0 ? (
        <p className="empty-cart">Your cart is empty. Try voice shopping!</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.items.map((item, i) => (
              <div key={i} className="cart-item">
                <span className="item-name">{item.product?.name || 'Product'}</span>
                <span className="item-qty">×{item.quantity}</span>
                <span className="item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <strong>Total: ₹{cart.totalAmount?.toLocaleString('en-IN')}</strong>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>✅ Checkout</button>
        </>
      )}
    </div>
  );
}

export default CartView;
