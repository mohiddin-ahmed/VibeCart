import React, { useState } from 'react';

function CartView({ items, clearCart, goShop }) {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const delivery = subtotal > 0 ? 0 : 0;
  const discount = subtotal > 10000 ? 500 : 0;
  const total = subtotal - discount;

  const handleCheckout = () => {
    if (items.length === 0) return;
    const orderDetails = {
      id: 'VB-' + Math.floor(100000 + Math.random() * 900000),
      items: [...items],
      total: total,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      deliveryDate: 'Within 2-3 Business Days'
    };
    setPlacedOrder(orderDetails);
    setShowOrderModal(true);
    clearCart();
  };

  return (
    <div className="cart-view">
      <div className="cart-header">
        <h2>🛒 Shopping Bag</h2>
        {items.length > 0 && (
          <span className="cart-count">{items.reduce((s, i) => s + i.quantity, 0)} items</span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛍️</div>
          <h3>Your shopping bag is empty</h3>
          <p className="empty-sub">Explore the catalog with VibeCart Voice AI or browse below.</p>
          <button className="shop-btn" onClick={goShop}>✨ Discover Products</button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item, i) => (
              <div key={i} className="cart-item">
                <div className="cart-item-image-wrapper">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="cart-item-thumbnail" />
                  ) : (
                    <div className="cart-item-placeholder">📦</div>
                  )}
                </div>

                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-brand">by {item.brand}</div>
                  <div className="cart-item-meta">
                    <span className="cart-item-unit-price">₹{item.price?.toLocaleString('en-IN')} each</span>
                    <span className="cart-item-qty">Qty: {item.quantity}</span>
                  </div>
                </div>

                <div className="cart-item-price">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="cart-row">
              <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="cart-row">
              <span>Standard Express Delivery</span>
              <span className="free-delivery">FREE</span>
            </div>
            {discount > 0 && (
              <div className="cart-row">
                <span>AI First-Order Discount</span>
                <span className="discount">-₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="cart-row total">
              <span>Total Amount</span>
              <span className="total-highlight">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            🔒 Proceed to Secure Checkout • ₹{total.toLocaleString('en-IN')}
          </button>

          <p className="secure-text">
            🛡️ Encrypted Voice Checkout powered by Agora RTC & Murf Falcon
          </p>
        </>
      )}

      {/* Professional In-App Order Confirmation Modal (Replaces browser alert) */}
      {showOrderModal && placedOrder && (
        <div className="modal-backdrop" onClick={() => setShowOrderModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-success-icon">✓</div>
            <h2>Order Confirmed!</h2>
            <p className="modal-sub">Thank you for shopping with VibeCart AI Assistant.</p>

            <div className="order-details-card">
              <div className="order-detail-row">
                <span className="detail-label">Order Number:</span>
                <span className="detail-value order-id">{placedOrder.id}</span>
              </div>
              <div className="order-detail-row">
                <span className="detail-label">Estimated Delivery:</span>
                <span className="detail-value">{placedOrder.deliveryDate}</span>
              </div>
              <div className="order-detail-row">
                <span className="detail-label">Total Paid:</span>
                <span className="detail-value price-green">₹{placedOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="modal-items-summary">
              <p className="items-summary-title">Items Ordered ({placedOrder.items.length}):</p>
              <div className="modal-items-list">
                {placedOrder.items.map((it, idx) => (
                  <div key={idx} className="modal-item-line">
                    <span>{it.name} × {it.quantity}</span>
                    <span>₹{(it.price * it.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="modal-action-btn"
              onClick={() => {
                setShowOrderModal(false);
                goShop();
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartView;
