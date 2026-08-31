import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../stores/cartStore';
import { useAuth } from '../stores/authStore';
import { orderService } from '../services/api';
import '../styles/Checkout.css';

export const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCart();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const updateField = (key, value) => setForm({ ...form, [key]: value });

  const handlePlaceOrder = async () => {
    if (!token) {
      alert('Please sign in before placing an order.');
      navigate('/login');
      return;
    }

    if (!form.firstName || !form.lastName || !form.email || !form.address) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const shippingAddress = `${form.address}, ${form.city}, ${form.state} ${form.zip}`;
      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      await orderService.createOrder(orderItems, shippingAddress);
      clearCart();
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      alert('Order failed: ' + (err.response?.data?.error || 'Please try again'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout">
      <div className="breadcrumb">
        <a href="/">Home</a> / <a href="/cart">Cart</a> / <span>Checkout</span>
      </div>

      <div className="checkout-container">
        <div className="checkout-main">
          <h1>Checkout</h1>

          {/* Order Summary */}
          <div className="order-summary-card">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {items.map((item) => (
                <div key={item.id} className="summary-item">
                  <span>{item.name} × {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="divider"></div>
            <div className="summary-total">
              <span>Total</span>
              <span>${getTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping Form */}
          <div className="form-card">
            <h3>Shipping Information</h3>
            <div className="form-grid">
              <input
                type="text"
                placeholder="First Name *"
                value={form.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name *"
                value={form.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
              />
            </div>

            <input
              type="email"
              placeholder="Email *"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
            />

            <input
              type="tel"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
            />

            <textarea
              placeholder="Address *"
              value={form.address}
              onChange={(e) => updateField('address', e.target.value)}
            />

            <div className="form-grid">
              <input
                type="text"
                placeholder="City"
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
              />
              <input
                type="text"
                placeholder="State"
                value={form.state}
                onChange={(e) => updateField('state', e.target.value)}
              />
              <input
                type="text"
                placeholder="ZIP Code"
                value={form.zip}
                onChange={(e) => updateField('zip', e.target.value)}
              />
            </div>
          </div>

          <div className="info-banner">
            <span>🔒</span>
            <p>Your payment is secure and processed by Clover.</p>
          </div>

          <button
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};
