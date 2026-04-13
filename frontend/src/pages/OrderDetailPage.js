import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../api/orders';
import Loader from '../components/Loader';

const statusColors = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'danger',
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id)
      .then((res) => setOrder(res.data.order))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return <div className="container py-5 text-center"><h4>Order not found</h4></div>;

  return (
    <div className="container py-4">
      <Link to="/orders" className="btn btn-outline-secondary mb-4">
        <i className="fas fa-arrow-left me-2"></i>Back to Orders
      </Link>

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="fw-bold mb-0">Order #{order._id.slice(-8).toUpperCase()}</h2>
        <span className={`badge bg-${statusColors[order.status] || 'secondary'} fs-6`}>
          {order.status}
        </span>
      </div>

      <div className="row g-4">
        <div className="col-md-8">
          {/* Shipping */}
          <div className="bg-white rounded-3 p-4 border mb-3">
            <h5 className="fw-bold mb-3"><i className="fas fa-truck me-2 text-warning"></i>Shipping</h5>
            <p className="mb-1"><strong>Address:</strong> {order.shippingAddress.address}</p>
            <p className="mb-1">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            <p className="mb-0">{order.shippingAddress.country}</p>
            {order.isDelivered ? (
              <div className="alert alert-success mt-2 mb-0 py-2">
                Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
              </div>
            ) : (
              <div className="alert alert-warning mt-2 mb-0 py-2">Not yet delivered</div>
            )}
          </div>

          {/* Payment */}
          <div className="bg-white rounded-3 p-4 border mb-3">
            <h5 className="fw-bold mb-3"><i className="fas fa-credit-card me-2 text-warning"></i>Payment</h5>
            <p className="mb-1"><strong>Method:</strong> {order.paymentMethod}</p>
            {order.isPaid ? (
              <div className="alert alert-success mt-2 mb-0 py-2">
                Paid on {new Date(order.paidAt).toLocaleDateString()}
              </div>
            ) : (
              <div className="alert alert-danger mt-2 mb-0 py-2">Not paid</div>
            )}
          </div>

          {/* Items */}
          <div className="bg-white rounded-3 p-4 border">
            <h5 className="fw-bold mb-3"><i className="fas fa-box me-2 text-warning"></i>Order Items</h5>
            {order.orderItems.map((item) => (
              <div key={item._id} className="d-flex align-items-center gap-3 mb-3">
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '60px', height: '60px', objectFit: 'contain', background: '#f8f8f8', borderRadius: '6px', padding: '4px' }}
                />
                <Link to={`/products/${item.product}`} className="flex-grow-1 text-dark text-decoration-none">
                  {item.name}
                </Link>
                <span className="text-muted">{item.qty} × ${item.price.toFixed(2)}</span>
                <span className="fw-bold">${(item.qty * item.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="col-md-4">
          <div className="cart-summary">
            <h5 className="fw-bold mb-3">Order Summary</h5>
            <div className="d-flex justify-content-between mb-2">
              <span>Items</span><span>${order.itemsPrice.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Tax</span><span>${order.taxPrice.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Shipping</span>
              <span>{order.shippingPrice === 0 ? <span className="text-success">FREE</span> : `$${order.shippingPrice.toFixed(2)}`}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5">
              <span>Total</span><span>${order.totalPrice.toFixed(2)}</span>
            </div>
            <p className="text-muted small mt-2">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
