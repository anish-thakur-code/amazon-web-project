import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import StarRating from './StarRating';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.countInStock === 0) {
      toast.error('Out of stock');
      return;
    }
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
      <div className="product-card">
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400'; }}
        />
        <div className="product-card-body">
          <p className="product-card-title">{product.name}</p>
          <StarRating rating={product.rating} numReviews={product.numReviews} />
          <p className="product-price">${product.price.toFixed(2)}</p>
          {product.countInStock === 0 ? (
            <span className="badge bg-danger w-100 py-2">Out of Stock</span>
          ) : (
            <button className="btn-add-cart" onClick={handleAddToCart}>
              <i className="fas fa-cart-plus me-1"></i> Add to Cart
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
