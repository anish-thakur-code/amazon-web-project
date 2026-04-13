import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/orders';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState({
    address: '', city: '', postalCode: '', country: 'US',
  });
  const [paymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  const tax = cartTotal * 0.1;
  const shippingCost = cartTotal > 50 ? 0 : 9.99;
  const total = cartTotal + tax + shippingCost;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          qty: item.qty,
        })),
        shippingAddress: shipping,
        paymentMethod,
        itemsPrice: cartTotal,
        taxPrice: tax,
        shippingPrice: shippingCost,
        totalPrice: total,
      };

      const res = await createOrder(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-success/${res.data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '800px' }}>
      <h2 className="fw-bold mb-4">Checkout</h2>

      {/* Steps */}
      <div className="d-flex mb-4 gap-2">
        {['Shipping', 'Review & Pay'].map((s, i) => (
          <div
            key={s}
            className={`px-3 py-2 rounded fw-bold ${step === i + 1 ? 'bg-warning' : step > i + 1 ? 'bg-success text-white' : 'bg-light text-muted'}`}
          >
            {i + 1}. {s}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-white rounded-3 p-4 border">
          <h5 className="fw-bold mb-3">Shipping Address</h5>
          <form onSubmit={handleShippingSubmit}>
            <div className="mb-3">
              <label className="form-label">Street Address</label>
              <input
                className="form-control"
                value={shipping.address}
                onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                required
                placeholder="123 Main St"
              />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">City</label>
                <input
                  className="form-control"
                  value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  required
                  placeholder="New York"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Postal Code</label>
                <input
                  className="form-control"
                  value={shipping.postalCode}
                  onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                  required
                  placeholder="10001"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Country</label>
              <select
                className="form-select"
                value={shipping.country}
                onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
              >
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="IN">India</option>
              </select>
            </div>
            <button type="submit" className="btn btn-warning fw-bold px-4">
              Continue to Review <i className="fas fa-arrow-right ms-2"></i>
            </button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="row g-4">
          <div className="col-md-7">
            <div className="bg-white rounded-3 p-4 border mb-3">
              <h5 className="fw-bold mb-3">Shipping To</h5>
              <p className="mb-0">{shipping.address}, {shipping.city}, {shipping.postalCode}, {shipping.country}</p>
              <button className="btn btn-link p-0 mt-1" onClick={() => setStep(1)}>Edit</button>
            </div>

            <div className="bg-white rounded-3 p-4 border mb-3">
              <h5 className="fw-bold mb-3">Payment Method</h5>
              <p className="mb-0"><i className="fas fa-money-bill-wave me-2 text-success"></i>Cash on Delivery</p>
            </div>

            <div className="bg-white rounded-3 p-4 border">
              <h5 className="fw-bold mb-3">Order Items</h5>
              {cartItems.map((item) => (
                <div key={item._id} className="d-flex align-items-center gap-3 mb-2">
                  <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                  <span className="flex-grow-1">{item.name} × {item.qty}</span>
                  <span className="fw-bold">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-5">
            <div className="cart-summary">
              <h5 className="fw-bold mb-3">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Items</span><span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax</span><span>${tax.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? <span className="text-success">FREE</span> : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
              <button
                className="btn btn-warning w-100 fw-bold py-2"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span>Placing Order...</>
                ) : (
                  <><i className="fas fa-check-circle me-2"></i>Place Order</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
