import React, { useState, useEffect } from 'react';
import { productService, bannerService, setupInventorySync, closeInventorySync } from '../services/api';
import '../styles/Home.css';

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSync, setLastSync] = useState(null);

  const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Dresses', 'Accessories', 'Outerwear'];

  const loadData = async () => {
    try {
      const [productsRes, bannersRes] = await Promise.all([
        productService.getProducts(),
        bannerService.getBanners(),
      ]);
      setProducts(productsRes.data);
      setBanners(bannersRes.data);
      setLastSync(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Setup real-time sync with SSE
    setupInventorySync(loadData);

    // Refresh when page becomes visible
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    };

    // Fallback polling every 30 seconds
    const refreshInterval = window.setInterval(loadData, 30000);
    document.addEventListener('visibilitychange', refreshWhenVisible);

    // Cleanup
    return () => {
      window.clearInterval(refreshInterval);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
      closeInventorySync();
    };
  }, []);

  const filteredProducts = products
    .filter(p => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        return (
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return true;
    })
    .slice(0, 8);

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
          <a href="#products" className="cta-button" onClick={() => {
            setSelectedCategory('All');
            setSearchQuery('');
          }}>Shop Now</a>
        </div>
      </div>

      {/* Search & Filter */}
      <section className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {lastSync && <span className="sync-indicator">✓ Synced at {lastSync}</span>}
        </div>

        <div className="categories-filter">
          {CATEGORIES.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="section">
        <h2>
          {searchQuery ? `Search Results (${filteredProducts.length})` : `${selectedCategory === 'All' ? 'Featured' : selectedCategory} Products`}
        </h2>
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
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
            ))
          ) : (
            <div className="empty-state">
              <p>No products found</p>
              <button 
                className="reset-btn"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              >
                Reset filters
              </button>
            </div>
          )}
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
