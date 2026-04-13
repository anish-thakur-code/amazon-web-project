import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getAllOrders } from '../../api/orders';
import { fetchProducts } from '../../api/products';
import { getAllUsers } from '../../api/users';
import Loader from '../../components/Loader';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ orders: 0, products: 0, users: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          getAllOrders(),
          fetchProducts({ pageSize: 100 }),
          getAllUsers(),
        ]);
        const orders = ordersRes.data.orders;
        const revenue = orders.filter((o) => o.isPaid).reduce((acc, o) => acc + o.totalPrice, 0);
        setStats({
          orders: orders.length,
          products: productsRes.data.total,
          users: usersRes.data.users.length,
          revenue,
        });
        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards = [
    { label: 'Total Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: 'fa-dollar-sign', color: '#28a745' },
    { label: 'Total Orders', value: stats.orders, icon: 'fa-shopping-bag', color: '#007bff' },
    { label: 'Total Products', value: stats.products, icon: 'fa-box', color: '#f90' },
    { label: 'Total Users', value: stats.users, icon: 'fa-users', color: '#6f42c1' },
  ];

  if (loading) return <AdminLayout><Loader /></AdminLayout>;

  return (
    <AdminLayout>
      <h3 className="fw-bold mb-4">Dashboard Overview</h3>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {statCards.map((card) => (
          <div key={card.label} className="col-sm-6 col-xl-3">
            <div className="admin-stat-card" style={{ borderLeftColor: card.color }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">{card.label}</p>
                  <h4 className="fw-bold mb-0">{card.value}</h4>
                </div>
                <i className={`fas ${card.icon} fa-2x`} style={{ color: card.color, opacity: 0.6 }}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-3 border p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Recent Orders</h5>
          <Link to="/admin/orders" className="btn btn-sm btn-outline-warning">View All</Link>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id}>
                  <td className="fw-bold">#{order._id.slice(-8).toUpperCase()}</td>
                  <td>{order.user?.name || 'N/A'}</td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>
                    <span className={`badge badge-${order.status}`}>{order.status}</span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
