import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import { useCart } from '../stores/cartStore';
import '../styles/ProductDetail.css';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await productService.getProductById(id);
      setProduct(response.data);
    } catch (err) {
      console.error('Failed to load product', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`${product.name} added to cart!`);
    navigate('/cart');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="product-detail">
      <div className="breadcrumb">
        <a href="/">Home</a> / <span>{product.name}</span>
      </div>

      <div className="detail-container">
        <div className="product-image">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} />
          ) : (
            <div className="image-placeholder">✨</div>
          )}
        </div>

        <div className="product-content">
          {product.category && <p className="category">{product.category.toUpperCase()}</p>}
          <h1>{product.name}</h1>
          <p className="price">${product.price}</p>

          {product.quantity_available > 0 ? (
            <span className="badge in-stock">✓ In Stock</span>
          ) : (
            <span className="badge out-of-stock">Out of Stock</span>
          )}

          {product.description && (
            <div className="description">
              <h3>About This Item</h3>
              <p>{product.description}</p>
            </div>
          )}

          <div className="quantity-selector">
            <label>Quantity</label>
            <div className="qty-control">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <input type="number" value={quantity} readOnly />
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={product.quantity_available <= 0}
          >
            {product.quantity_available > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>

          <div className="info-list">
            <div className="info-item">
              <span>🚚</span>
              <p>Free shipping on orders over $50</p>
            </div>
            <div className="info-item">
              <span>↩️</span>
              <p>30-day returns</p>
            </div>
            <div className="info-item">
              <span>🔒</span>
              <p>Secure checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
