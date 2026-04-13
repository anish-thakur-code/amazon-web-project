import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQty, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const tax = cartTotal * 0.1;
  const shipping = cartTotal > 50 ? 0 : 9.99;
  const orderTotal = cartTotal + tax + shipping;

  const handleCheckout = () => {
    if (!user) {
      toast.info('Please login to checkout');
      navigate('/login?redirect=checkout');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <i className="fas fa-shopping-cart fa-5x text-muted mb-4"></i>
        <h3>Your cart is empty</h3>
        <p className="text-muted mb-4">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn btn-warning btn-lg fw-bold">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">
        <i className="fas fa-shopping-cart me-2 text-warning"></i>
        Shopping Cart ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})
      </h2>

      <div className="row g-4">
        {/* Cart Items */}
        <div className="col-lg-8">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item d-flex gap-3 align-items-center flex-wrap">
              <img
                src={item.image}
                alt={item.name}
                style={{ width: '100px', height: '100px', objectFit: 'contain', background: '#f8f8f8', borderRadius: '8px', padding: '8px' }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }}
              />
              <div className="flex-grow-1">
                <Link to={`/products/${item._id}`} className="text-dark text-decoration-none fw-bold">
                  {item.name}
                </Link>
                <p className="text-danger fw-bold mb-1">${item.price.toFixed(2)}</p>
                <div className="d-flex align-items-center gap-2">
                  <label className="text-muted small">Qty:</label>
                  <select
                    className="form-select form-select-sm w-auto"
                    value={item.qty}
                    onChange={(e) => updateQty(item._id, Number(e.target.value))}
                  >
                    {[...Array(Math.min(item.countInStock, 10))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeFromCart(item._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <div className="text-end">
                <p className="fw-bold fs-5">${(item.price * item.qty).toFixed(2)}</p>
              </div>
            </div>
          ))}

          <button className="btn btn-outline-danger mt-2" onClick={clearCart}>
            <i className="fas fa-trash me-2"></i>Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="cart-summary">
            <h5 className="fw-bold mb-3">Order Summary</h5>
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="text-success">FREE</span> : `$${shipping.toFixed(2)}`}</span>
            </div>
            {shipping > 0 && (
              <p className="text-muted small">Add ${(50 - cartTotal).toFixed(2)} more for free shipping</p>
            )}
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
              <span>Total</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>
            <button className="btn btn-warning w-100 fw-bold py-2" onClick={handleCheckout}>
              Proceed to Checkout <i className="fas fa-arrow-right ms-2"></i>
            </button>
            <Link to="/products" className="btn btn-outline-secondary w-100 mt-2">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
