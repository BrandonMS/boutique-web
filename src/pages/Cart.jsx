import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../stores/cartStore';
import '../styles/Cart.css';

export const Cart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-state">
          <p className="empty-icon">🛍️</p>
          <h2>Your Cart is Empty</h2>
          <p>Start shopping to add items</p>
          <a href="/" className="continue-shopping">Continue Shopping</a>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <h1>My Cart</h1>
      <p className="item-count">{items.length} item{items.length !== 1 ? 's' : ''}</p>

      <div className="cart-container">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="image-placeholder">✨</div>
                )}
              </div>

              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="price">${item.price}</p>

                <div className="qty-row">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                  <input type="number" value={item.quantity} readOnly />
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  <span className="subtotal">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>

              <button className="remove-btn" onClick={() => removeFromCart(item.id)}>✕</button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${getTotal().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="divider"></div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${getTotal().toFixed(2)}</span>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
          <a href="/" className="continue-shopping">Continue Shopping</a>
        </div>
      </div>
    </div>
  );
};
