import React, { useState, useEffect } from 'react';
import { productService, bannerService } from '../services/api';
import '../styles/Home.css';

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();

    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    };
    const refreshInterval = window.setInterval(loadData, 30000);
    document.addEventListener('visibilitychange', refreshWhenVisible);

    return () => {
      window.clearInterval(refreshInterval);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, bannersRes] = await Promise.all([
        productService.getProducts(),
        bannerService.getBanners(),
      ]);
      setProducts(productsRes.data);
      setBanners(bannersRes.data);
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      {/* Hero Banner */}
      <div className="hero">
        <div className="hero-content">
          <h1>New Collection</h1>
          <p>Discover our latest curated selection</p>
          <a href="#products" className="cta-button">Shop Now</a>
        </div>
      </div>

      {/* Featured Products */}
      <section id="products" className="section">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {products.slice(0, 8).map((product) => (
            <a key={product.id} href={`/product/${product.id}`} className="product-card">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} />
              ) : (
                <div className="product-image-placeholder">✨</div>
              )}
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">${product.price}</p>
                {product.quantity_available > 0 ? (
                  <span className="badge in-stock">In Stock</span>
                ) : (
                  <span className="badge out-of-stock">Out of Stock</span>
                )}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="info-section">
        <div className="info-item">
          <span className="icon">🚚</span>
          <h3>Free Shipping</h3>
          <p>On orders over $50</p>
        </div>
        <div className="info-item">
          <span className="icon">↩️</span>
          <h3>Easy Returns</h3>
          <p>30-day return policy</p>
        </div>
        <div className="info-item">
          <span className="icon">🔒</span>
          <h3>Secure Checkout</h3>
          <p>Powered by Clover</p>
        </div>
      </section>
    </div>
  );
};
