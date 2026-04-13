import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

/* ── static hero slides ── */
const heroSlides = [
  {
    title: 'New iPhone 15 Pro Max',
    subtitle: 'Titanium. So strong. So light. So Pro.',
    cta: 'Shop Mobiles',
    category: 'Mobiles',
    bg: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)',
    img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=420&q=80',
  },
  {
    title: 'MacBook Air M3',
    subtitle: 'Supercharged for what\'s next. 18-hr battery.',
    cta: 'Shop Laptops',
    category: 'Laptops',
    bg: 'linear-gradient(135deg,#0d0d0d 0%,#1a1a1a 50%,#2d2d2d 100%)',
    img: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=420&q=80',
  },
  {
    title: 'PlayStation 5',
    subtitle: 'Play has no limits. Feel the future of gaming.',
    cta: 'Shop Electronics',
    category: 'Electronics',
    bg: 'linear-gradient(135deg,#003087 0%,#0070cc 100%)',
    img: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=420&q=80',
  },
];

/* ── category showcase ── */
const categoryCards = [
  { label: 'Mobiles',     icon: '📱', color: '#e8f4fd', border: '#3498db', cat: 'Mobiles' },
  { label: 'Laptops',     icon: '💻', color: '#fef9e7', border: '#f39c12', cat: 'Laptops' },
  { label: 'Electronics', icon: '🎧', color: '#fdf2f8', border: '#9b59b6', cat: 'Electronics' },
  { label: 'Clothing',    icon: '👕', color: '#eafaf1', border: '#27ae60', cat: 'Clothing' },
  { label: 'Footwear',    icon: '👟', color: '#fef5e7', border: '#e67e22', cat: 'Footwear' },
  { label: 'Kitchen',     icon: '🍳', color: '#fdedec', border: '#e74c3c', cat: 'Kitchen' },
  { label: 'Books',       icon: '📚', color: '#eaf2ff', border: '#2980b9', cat: 'Books' },
  { label: 'Sports',      icon: '🏋️', color: '#e8f8f5', border: '#1abc9c', cat: 'Sports' },
];

/* ── deal timer helper ── */
const useCountdown = () => {
  const [time, setTime] = useState({ h: 5, m: 59, s: 59 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 5; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return time;
};

const pad = (n) => String(n).padStart(2, '0');

const HomePage = () => {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const timer = useCountdown();

  /* auto-advance hero */
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 4500);
    return () => clearInterval(t);
  }, []);

  /* fetch products per category */
  useEffect(() => {
    const cats = ['Mobiles', 'Laptops', 'Electronics', 'Clothing', 'Footwear', 'Kitchen', 'Books', 'Sports'];
    Promise.all(cats.map((c) => fetchProducts({ category: c, pageSize: 4 })))
      .then((results) => {
        const map = {};
        cats.forEach((c, i) => { map[c] = results[i].data.products; });
        setProductsByCategory(map);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const current = heroSlides[slide];

  return (
    <div style={{ background: '#f3f3f3' }}>

      {/* ══════════════ HERO BANNER ══════════════ */}
      <div style={{ background: current.bg, transition: 'background 0.8s ease', minHeight: '380px' }}
        className="d-flex align-items-center">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-md-6 text-white mb-4 mb-md-0">
              <span className="badge bg-warning text-dark mb-2 px-3 py-2" style={{ fontSize: '0.8rem' }}>
                ⚡ New Arrival
              </span>
              <h1 className="fw-bold mb-2" style={{ fontSize: '2.6rem', lineHeight: 1.2 }}>
                {current.title}
              </h1>
              <p className="mb-4 opacity-75 fs-5">{current.subtitle}</p>
              <div className="d-flex gap-3 flex-wrap">
                <button
                  className="btn btn-warning btn-lg fw-bold px-4"
                  onClick={() => navigate(`/products?category=${current.category}`)}
                >
                  {current.cta} <i className="fas fa-arrow-right ms-2"></i>
                </button>
                <Link to="/products" className="btn btn-outline-light btn-lg px-4">
                  View All
                </Link>
              </div>
            </div>
            <div className="col-md-6 text-center">
              <img
                src={current.img}
                alt={current.title}
                style={{ maxHeight: '300px', maxWidth: '100%', objectFit: 'contain',
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))', transition: 'opacity 0.5s' }}
              />
            </div>
          </div>
          {/* slide dots */}
          <div className="d-flex justify-content-center gap-2 mt-3">
            {heroSlides.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)}
                style={{ width: i === slide ? '28px' : '10px', height: '10px', borderRadius: '5px',
                  background: i === slide ? '#f90' : 'rgba(255,255,255,0.4)',
                  border: 'none', transition: 'all 0.3s', padding: 0 }} />
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════ DEALS OF THE DAY ══════════════ */}
      <div className="container mt-4">
        <div className="bg-white rounded-3 p-4 border mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
            <div className="d-flex align-items-center gap-3">
              <h4 className="fw-bold mb-0" style={{ color: '#b12704' }}>
                🔥 Deals of the Day
              </h4>
              <div className="d-flex align-items-center gap-1">
                <span className="text-muted small">Ends in:</span>
                {[pad(timer.h), pad(timer.m), pad(timer.s)].map((v, i) => (
                  <React.Fragment key={i}>
                    <span className="badge text-white px-2 py-1 fw-bold"
                      style={{ background: '#131921', fontSize: '1rem', minWidth: '36px' }}>{v}</span>
                    {i < 2 && <span className="fw-bold text-danger">:</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <Link to="/products" className="btn btn-sm btn-outline-warning fw-bold">
              See all deals
            </Link>
          </div>

          {loading ? <Loader /> : (
            <div className="row g-3">
              {[
                ...(productsByCategory['Mobiles'] || []).slice(0, 1),
                ...(productsByCategory['Laptops'] || []).slice(0, 1),
                ...(productsByCategory['Electronics'] || []).slice(0, 2),
              ].map((product) => (
                <div key={product._id} className="col-6 col-md-3">
                  <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                    <div className="text-center p-3 rounded-3 h-100"
                      style={{ border: '2px solid #ffd814', background: '#fffbf0', transition: 'transform 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                      <span className="badge bg-danger mb-2">Up to 30% off</span>
                      <img src={product.image} alt={product.name}
                        style={{ height: '130px', objectFit: 'contain', width: '100%' }}
                        onError={e => { e.target.src = 'https://via.placeholder.com/200'; }} />
                      <p className="fw-bold mt-2 mb-1 text-dark" style={{ fontSize: '0.85rem' }}>
                        {product.name.length > 35 ? product.name.slice(0, 35) + '…' : product.name}
                      </p>
                      <p className="text-danger fw-bold mb-0">${product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ══════════════ CATEGORY SHOWCASE ══════════════ */}
        <div className="bg-white rounded-3 p-4 border mb-4">
          <h4 className="fw-bold mb-3">Shop by Category</h4>
          <div className="row g-3">
            {categoryCards.map((c) => (
              <div key={c.cat} className="col-6 col-sm-4 col-md-3 col-lg-3">
                <button onClick={() => navigate(`/products?category=${c.cat}`)}
                  className="w-100 border-0 rounded-3 p-3 text-center"
                  style={{ background: c.color, borderLeft: `4px solid ${c.border} !important`,
                    cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: `0 2px 8px ${c.border}22` }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${c.border}44`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 2px 8px ${c.border}22`; }}>
                  <div style={{ fontSize: '2.2rem', marginBottom: '6px' }}>{c.icon}</div>
                  <div className="fw-bold" style={{ color: '#131921', fontSize: '0.9rem' }}>{c.label}</div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════ PRODUCT ROWS BY CATEGORY ══════════════ */}
        {loading ? <Loader /> : (
          Object.entries(productsByCategory).map(([cat, products]) =>
            products.length > 0 ? (
              <div key={cat} className="bg-white rounded-3 p-4 border mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: '1.4rem' }}>
                      {categoryCards.find(c => c.cat === cat)?.icon || '🛍️'}
                    </span>
                    <h5 className="fw-bold mb-0">{cat}</h5>
                  </div>
                  <Link to={`/products?category=${cat}`}
                    className="btn btn-sm fw-bold"
                    style={{ color: '#007185', background: 'none', border: 'none', textDecoration: 'underline' }}>
                    See all in {cat} →
                  </Link>
                </div>
                <div className="row g-3">
                  {products.map((product) => (
                    <div key={product._id} className="col-6 col-md-3">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          )
        )}

        {/* ══════════════ PROMO STRIP ══════════════ */}
        <div className="row g-3 mb-4">
          {[
            { icon: '🚚', title: 'Free Delivery', sub: 'On orders over $50' },
            { icon: '🔄', title: 'Easy Returns', sub: '30-day return policy' },
            { icon: '🔒', title: 'Secure Payment', sub: 'SSL encrypted checkout' },
            { icon: '🎧', title: '24/7 Support', sub: 'Always here to help' },
          ].map((item) => (
            <div key={item.title} className="col-6 col-md-3">
              <div className="bg-white rounded-3 p-3 border text-center h-100">
                <div style={{ fontSize: '2rem', marginBottom: '6px' }}>{item.icon}</div>
                <div className="fw-bold" style={{ fontSize: '0.9rem' }}>{item.title}</div>
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ══════════════ BOTTOM BANNER ══════════════ */}
        <div className="rounded-3 p-5 text-white text-center mb-4"
          style={{ background: 'linear-gradient(135deg,#131921 0%,#232f3e 60%,#37475a 100%)' }}>
          <h3 className="fw-bold mb-2">🎉 New Members Get 10% Off</h3>
          <p className="opacity-75 mb-3">Create a free account and save on your first order</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/register" className="btn btn-warning btn-lg fw-bold px-5">
              Join Free Today
            </Link>
            <Link to="/products" className="btn btn-outline-light btn-lg px-4">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
