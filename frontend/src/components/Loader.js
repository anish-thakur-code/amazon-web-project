import React from 'react';

const Loader = () => (
  <div className="spinner-overlay">
    <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export default Loader;
