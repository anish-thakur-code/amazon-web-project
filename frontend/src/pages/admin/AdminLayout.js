import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: 'fa-tachometer-alt' },
    { path: '/admin/products', label: 'Products', icon: 'fa-box' },
    { path: '/admin/orders', label: 'Orders', icon: 'fa-shopping-bag' },
    { path: '/admin/users', label: 'Users', icon: 'fa-users' },
  ];

  return (
    <div className="d-flex" style={{ minHeight: 'calc(100vh - 60px)' }}>
      <div className="admin-sidebar" style={{ width: '220px', flexShrink: 0 }}>
        <p className="text-muted px-4 py-2 small text-uppercase fw-bold">Admin Panel</p>
        <nav>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <i className={`fas ${item.icon} me-2`}></i>
              {item.label}
            </Link>
          ))}
        </nav>
        <hr style={{ borderColor: '#37475a' }} />
        <Link to="/" className="nav-link">
          <i className="fas fa-store me-2"></i>Back to Store
        </Link>
      </div>
      <div className="flex-grow-1 p-4 bg-light">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
