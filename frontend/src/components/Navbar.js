import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${keyword.trim()}`);
      setKeyword('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <>
      {/* ── Top bar ── */}
      <nav style={{ background: '#131921', padding: '10px 20px' }}
        className="d-flex align-items-center gap-3 flex-wrap">

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 800, letterSpacing: 1 }}>
            Shop<span style={{ color: '#f90' }}>Zone</span>
          </span>
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSearch}
          className="flex-grow-1 d-flex"
          style={{ maxWidth: '680px', borderRadius: '6px', overflow: 'hidden', minWidth: '180px' }}>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search products, brands and more..."
            style={{ flex: 1, padding: '9px 14px', border: 'none', fontSize: '0.95rem', outline: 'none' }}
          />
          <button type="submit"
            style={{ background: '#febd69', border: 'none', padding: '0 18px', cursor: 'pointer', fontSize: '1rem', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f3a847'}
            onMouseLeave={e => e.currentTarget.style.background = '#febd69'}>
            <i className="fas fa-search"></i>
          </button>
        </form>

        {/* Right side */}
        <div className="d-flex align-items-center gap-2 ms-auto flex-shrink-0">

          {/* ── NOT LOGGED IN ── */}
          {!user && (
            <>
              <Link to="/login"
                style={{ color: '#fff', textDecoration: 'none', fontSize: '0.88rem',
                  padding: '7px 14px', border: '1px solid #555', borderRadius: '4px',
                  transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#fff'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#555'}>
                <i className="fas fa-sign-in-alt me-1"></i> Sign In
              </Link>
              <Link to="/register"
                style={{ color: '#131921', textDecoration: 'none', fontSize: '0.88rem',
                  padding: '7px 14px', background: '#febd69', borderRadius: '4px',
                  fontWeight: 700, transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f3a847'}
                onMouseLeave={e => e.currentTarget.style.background = '#febd69'}>
                <i className="fas fa-user-plus me-1"></i> Register
              </Link>
            </>
          )}

          {/* ── LOGGED IN AS USER ── */}
          {user && !isAdmin && (
            <div className="dropdown">
              <button data-bs-toggle="dropdown"
                style={{ background: 'none', border: '1px solid #555', borderRadius: '4px',
                  color: '#fff', padding: '7px 12px', cursor: 'pointer', fontSize: '0.88rem',
                  display: 'flex', alignItems: 'center', gap: '6px', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#fff'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#555'}>
                {/* avatar circle */}
                <span style={{ width: '26px', height: '26px', borderRadius: '50%',
                  background: '#f90', display: 'inline-flex', alignItems: 'center',
                  justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', color: '#131921' }}>
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span>{user.name.split(' ')[0]}</span>
                <i className="fas fa-chevron-down" style={{ fontSize: '0.7rem', opacity: 0.7 }}></i>
              </button>

              <ul className="dropdown-menu dropdown-menu-end shadow"
                style={{ minWidth: '200px', border: 'none', borderRadius: '8px', marginTop: '6px' }}>
                {/* header */}
                <li className="px-3 py-2" style={{ background: '#f8f9fa', borderRadius: '8px 8px 0 0' }}>
                  <div className="fw-bold" style={{ fontSize: '0.9rem' }}>{user.name}</div>
                  <div className="text-muted" style={{ fontSize: '0.78rem' }}>{user.email}</div>
                  <span className="badge bg-secondary mt-1" style={{ fontSize: '0.7rem' }}>Customer</span>
                </li>
                <li><hr className="dropdown-divider my-1" /></li>
                <li>
                  <Link className="dropdown-item py-2" to="/profile">
                    <i className="fas fa-user-circle me-2 text-muted"></i> My Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item py-2" to="/orders">
                    <i className="fas fa-box me-2 text-muted"></i> My Orders
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item py-2" to="/cart">
                    <i className="fas fa-shopping-cart me-2 text-muted"></i> My Cart
                    {cartCount > 0 && (
                      <span className="badge bg-warning text-dark ms-2">{cartCount}</span>
                    )}
                  </Link>
                </li>
                <li><hr className="dropdown-divider my-1" /></li>
                <li>
                  <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-2"></i> Logout
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* ── LOGGED IN AS ADMIN ── */}
          {user && isAdmin && (
            <div className="dropdown">
              <button data-bs-toggle="dropdown"
                style={{ background: '#c0392b', border: 'none', borderRadius: '4px',
                  color: '#fff', padding: '7px 12px', cursor: 'pointer', fontSize: '0.88rem',
                  display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700,
                  transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#a93226'}
                onMouseLeave={e => e.currentTarget.style.background = '#c0392b'}>
                <span style={{ width: '26px', height: '26px', borderRadius: '50%',
                  background: '#fff', display: 'inline-flex', alignItems: 'center',
                  justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', color: '#c0392b' }}>
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <i className="fas fa-shield-alt"></i>
                <span>Admin</span>
                <i className="fas fa-chevron-down" style={{ fontSize: '0.7rem', opacity: 0.8 }}></i>
              </button>

              <ul className="dropdown-menu dropdown-menu-end shadow"
                style={{ minWidth: '220px', border: 'none', borderRadius: '8px', marginTop: '6px' }}>
                {/* admin header */}
                <li className="px-3 py-2" style={{ background: '#fdedec', borderRadius: '8px 8px 0 0' }}>
                  <div className="fw-bold" style={{ fontSize: '0.9rem' }}>{user.name}</div>
                  <div className="text-muted" style={{ fontSize: '0.78rem' }}>{user.email}</div>
                  <span className="badge bg-danger mt-1" style={{ fontSize: '0.7rem' }}>
                    <i className="fas fa-shield-alt me-1"></i>Administrator
                  </span>
                </li>
                <li><hr className="dropdown-divider my-1" /></li>

                {/* admin panel links */}
                <li className="px-2">
                  <p className="text-muted mb-1 px-2" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Admin Panel
                  </p>
                </li>
                <li>
                  <Link className="dropdown-item py-2" to="/admin">
                    <i className="fas fa-tachometer-alt me-2" style={{ color: '#c0392b' }}></i> Dashboard
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item py-2" to="/admin/products">
                    <i className="fas fa-box me-2" style={{ color: '#c0392b' }}></i> Manage Products
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item py-2" to="/admin/orders">
                    <i className="fas fa-shopping-bag me-2" style={{ color: '#c0392b' }}></i> Manage Orders
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item py-2" to="/admin/users">
                    <i className="fas fa-users me-2" style={{ color: '#c0392b' }}></i> Manage Users
                  </Link>
                </li>
                <li><hr className="dropdown-divider my-1" /></li>

                {/* store links */}
                <li className="px-2">
                  <p className="text-muted mb-1 px-2" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Store
                  </p>
                </li>
                <li>
                  <Link className="dropdown-item py-2" to="/">
                    <i className="fas fa-store me-2 text-muted"></i> View Storefront
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item py-2" to="/profile">
                    <i className="fas fa-user-circle me-2 text-muted"></i> My Profile
                  </Link>
                </li>
                <li><hr className="dropdown-divider my-1" /></li>
                <li>
                  <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-2"></i> Logout
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Cart icon — shown for everyone */}
          <Link to="/cart"
            style={{ color: '#fff', textDecoration: 'none', position: 'relative',
              padding: '7px 10px', fontSize: '1.1rem' }}>
            <i className="fas fa-shopping-cart"></i>
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: '0px', right: '0px',
                background: '#f90', color: '#131921', borderRadius: '50%',
                width: '18px', height: '18px', fontSize: '0.65rem', fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* ── Secondary nav bar ── */}
      <div style={{ background: '#232f3e', padding: '6px 20px' }}
        className="d-flex align-items-center gap-3 flex-wrap">
        <Link to="/products" style={secLink}>
          <i className="fas fa-th me-1"></i> All Products
        </Link>
        <Link to="/products?category=Mobiles" style={secLink}>📱 Mobiles</Link>
        <Link to="/products?category=Laptops" style={secLink}>💻 Laptops</Link>
        <Link to="/products?category=Electronics" style={secLink}>🎧 Electronics</Link>
        <Link to="/products?category=Clothing" style={secLink}>👕 Clothing</Link>
        <Link to="/products?category=Footwear" style={secLink}>👟 Footwear</Link>
        <Link to="/products?category=Kitchen" style={secLink}>🍳 Kitchen</Link>
        <Link to="/products?category=Books" style={secLink}>📚 Books</Link>
        <Link to="/products?category=Sports" style={secLink}>🏋️ Sports</Link>

        {/* Admin quick link in secondary bar */}
        {isAdmin && (
          <Link to="/admin"
            style={{ ...secLink, marginLeft: 'auto', color: '#ff6b6b', fontWeight: 700 }}>
            <i className="fas fa-shield-alt me-1"></i> Admin Panel
          </Link>
        )}
      </div>
    </>
  );
};

const secLink = {
  color: '#ccc',
  textDecoration: 'none',
  fontSize: '0.83rem',
  padding: '2px 6px',
  borderRadius: '3px',
  whiteSpace: 'nowrap',
  transition: 'color 0.2s',
};

export default Navbar;
