import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../api/orders';
import Loader from '../components/Loader';

const statusColors = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'danger',
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-box-open fa-4x text-muted mb-3"></i>
          <h5>No orders yet</h5>
          <Link to="/products" className="btn btn-warning mt-2">Start Shopping</Link>
        </div>
      ) : (
        <div className="table-responsive bg-white rounded-3 border">
          <table className="table table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Paid</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="fw-bold">#{order._id.slice(-8).toUpperCase()}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.orderItems.length} item(s)</td>
                  <td className="fw-bold">${order.totalPrice.toFixed(2)}</td>
                  <td>
                    <span className={`badge bg-${statusColors[order.status] || 'secondary'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {order.isPaid ? (
                      <span className="text-success"><i className="fas fa-check-circle"></i></span>
                    ) : (
                      <span className="text-danger"><i className="fas fa-times-circle"></i></span>
                    )}
                  </td>
                  <td>
                    <Link to={`/orders/${order._id}`} className="btn btn-sm btn-outline-warning">
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
