import React, { useState, useEffect } from 'react';
import { orderService } from '../services/api';
import '../styles/Orders.css';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderService.getOrders();
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      completed: '✓',
      shipped: '📦',
      cancelled: '✕',
    };
    return icons[status] || '•';
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="orders">
      <h1>Order History</h1>

      {orders.length === 0 ? (
        <div className="empty-state">
          <p className="icon">📦</p>
          <h2>No Orders Yet</h2>
          <p>When you place an order, it will appear here</p>
          <a href="/">Continue Shopping</a>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const orderDate = new Date(order.created_at);
            const formattedDate = orderDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order.id}</h3>
                    <p className="date">{formattedDate}</p>
                  </div>
                  <div className={`status ${order.status}`}>
                    <span className="icon">{getStatusIcon(order.status)}</span>
                    <span className="text">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                  </div>
                </div>

                <div className="order-details">
                  <div className="detail-row">
                    <span>Total Amount</span>
                    <span className="amount">${order.total_amount}</span>
                  </div>
                  {order.shipping_address && (
                    <div className="detail-row">
                      <span>Shipping To</span>
                      <span>{order.shipping_address}</span>
                    </div>
                  )}
                  {order.tracking_url && (
                    <div className="detail-row">
                      <span>Tracking</span>
                      <a href={order.tracking_url} target="_blank" rel="noreferrer">Tracking Number</a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
