import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrderById } from '../api/orders';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrderById(id).then((res) => setOrder(res.data.order));
  }, [id]);

  return (
    <div className="container py-5 text-center" style={{ maxWidth: '600px' }}>
      <div className="bg-white rounded-3 p-5 border">
        <div className="mb-4">
          <i className="fas fa-check-circle fa-5x text-success"></i>
        </div>
        <h2 className="fw-bold text-success">Order Placed!</h2>
        <p className="text-muted mb-1">Thank you for your purchase.</p>
        {order && (
          <p className="text-muted">
            Order ID: <strong>#{order._id.slice(-8).toUpperCase()}</strong>
          </p>
        )}
        {order && (
          <div className="bg-light rounded-3 p-3 mb-4 text-start">
            <p className="mb-1"><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>
            <p className="mb-1"><strong>Payment:</strong> {order.paymentMethod}</p>
            <p className="mb-0"><strong>Status:</strong> <span className="badge bg-warning text-dark">{order.status}</span></p>
          </div>
        )}
        <div className="d-flex gap-2 justify-content-center">
          <Link to={`/orders/${id}`} className="btn btn-outline-warning fw-bold">
            View Order Details
          </Link>
          <Link to="/products" className="btn btn-warning fw-bold">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
