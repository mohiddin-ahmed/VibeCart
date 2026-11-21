import React from 'react';

function CartView({ items, clearCart, goShop }) {
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCheckout = () => {
    if (items.length === 0) return;
    alert(`🎉 Order placed successfully!\n\nTotal: ₹${total.toLocaleString('en-IN')}\nItems: ${items.length}\n\nThank you for shopping with VibeCart AI!`);
    clearCart();
  };

  return (
    <div className="cart-view">
      <div className="cart-header">
        <h2>🛒 Your Cart</h2>
        {items.length > 0 && (
          <span className="cart-count">{items.reduce((s, i) => s + i.quantity, 0)} items</span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <p>Your cart is empty</p>
          <p className="empty-sub">Start voice shopping or browse products!</p>
          <button className="shop-btn" onClick={goShop}>🛍️ Start Shopping</button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item, i) => (
              <div key={i} className="cart-item">
                <div className="cart-item-image">{item.emoji || '📦'}</div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-brand">{item.brand}</div>
                  <div className="cart-item-qty">Qty: {item.quantity}</div>
                </div>
                <div className="cart-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-row">
              <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div className="cart-row">
              <span>Delivery</span>
              <span className="free-delivery">FREE</span>
            </div>
            <div className="cart-row">
              <span>AI Shopping Discount</span>
              <span className="discount">-₹0</span>
            </div>
            <div className="cart-row total">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            ✅ Place Order — ₹{total.toLocaleString('en-IN')}
          </button>

          <p className="secure-text">🔒 Secured by Agora Voice Authentication</p>
        </>
      )}
    </div>
  );
}

export default CartView;
