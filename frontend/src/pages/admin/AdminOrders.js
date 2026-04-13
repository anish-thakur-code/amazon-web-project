import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getAllOrders, updateOrderStatus } from '../../api/orders';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';

const statusColors = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'danger',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllOrders()
      .then((res) => setOrders(res.data.orders))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
      toast.success('Order status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <AdminLayout>
      <h3 className="fw-bold mb-4">All Orders ({orders.length})</h3>

      {loading ? <Loader /> : (
        <div className="bg-white rounded-3 border">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="fw-bold">#{order._id.slice(-8).toUpperCase()}</td>
                    <td>
                      <div>{order.user?.name || 'N/A'}</div>
                      <small className="text-muted">{order.user?.email}</small>
                    </td>
                    <td>{order.orderItems.length}</td>
                    <td className="fw-bold">${order.totalPrice.toFixed(2)}</td>
                    <td>
                      {order.isPaid ? (
                        <span className="badge bg-success">Paid</span>
                      ) : (
                        <span className="badge bg-danger">Unpaid</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge bg-${statusColors[order.status] || 'secondary'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        style={{ minWidth: '120px' }}
                      >
                        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
