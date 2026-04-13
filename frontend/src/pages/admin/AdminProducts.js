import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { fetchProducts, deleteProduct } from '../../api/products';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const res = await fetchProducts({ pageSize: 100 });
      setProducts(res.data.products);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error('Failed to delete product');
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">Products ({products.length})</h3>
        <Link to="/admin/products/new" className="btn btn-warning fw-bold">
          <i className="fas fa-plus me-2"></i>Add Product
        </Link>
      </div>

      {loading ? <Loader /> : (
        <div className="bg-white rounded-3 border">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '50px', height: '50px', objectFit: 'contain', background: '#f8f8f8', borderRadius: '4px' }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
                      />
                    </td>
                    <td>
                      <span className="fw-bold" style={{ fontSize: '0.9rem' }}>
                        {product.name.length > 40 ? product.name.slice(0, 40) + '...' : product.name}
                      </span>
                    </td>
                    <td><span className="badge bg-secondary">{product.category}</span></td>
                    <td className="fw-bold text-danger">${product.price.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${product.countInStock > 0 ? 'bg-success' : 'bg-danger'}`}>
                        {product.countInStock}
                      </span>
                    </td>
                    <td>
                      <span className="text-warning">★</span> {product.rating.toFixed(1)}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(product._id, product.name)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
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

export default AdminProducts;
