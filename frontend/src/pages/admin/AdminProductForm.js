import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { fetchProductById, createProduct, updateProduct } from '../../api/products';
import { toast } from 'react-toastify';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '', description: '', price: '', category: '',
    brand: '', image: '', countInStock: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchProductById(id).then((res) => {
        const p = res.data.product;
        setForm({
          name: p.name, description: p.description, price: p.price,
          category: p.category, brand: p.brand || '', image: p.image,
          countInStock: p.countInStock,
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await updateProduct(id, form);
        toast.success('Product updated!');
      } else {
        await createProduct(form);
        toast.success('Product created!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h3 className="fw-bold mb-4">{isEdit ? 'Edit Product' : 'Add New Product'}</h3>

      <div className="bg-white rounded-3 border p-4" style={{ maxWidth: '700px' }}>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label fw-bold">Product Name *</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. iPhone 15 Pro"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Price ($) *</label>
              <input
                type="number"
                name="price"
                className="form-control"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Stock Quantity *</label>
              <input
                type="number"
                name="countInStock"
                className="form-control"
                value={form.countInStock}
                onChange={handleChange}
                required
                min="0"
                placeholder="0"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Category *</label>
              <select
                name="category"
                className="form-select"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                {['Electronics', 'Clothing', 'Books', 'Footwear', 'Kitchen', 'Sports', 'Beauty', 'Toys'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Brand</label>
              <input
                type="text"
                name="brand"
                className="form-control"
                value={form.brand}
                onChange={handleChange}
                placeholder="e.g. Apple"
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-bold">Image URL *</label>
              <input
                type="url"
                name="image"
                className="form-control"
                value={form.image}
                onChange={handleChange}
                required
                placeholder="https://example.com/image.jpg"
              />
              {form.image && (
                <img
                  src={form.image}
                  alt="Preview"
                  className="mt-2 rounded"
                  style={{ height: '100px', objectFit: 'contain', background: '#f8f8f8', padding: '8px' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
            </div>

            <div className="col-12">
              <label className="form-label fw-bold">Description *</label>
              <textarea
                name="description"
                className="form-control"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Product description..."
              />
            </div>

            <div className="col-12 d-flex gap-2">
              <button type="submit" className="btn btn-warning fw-bold px-4" disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate('/admin/products')}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminProductForm;
