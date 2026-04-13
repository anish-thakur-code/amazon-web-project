import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/auth';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;
      const res = await updateProfile(payload);
      updateUser(res.data.user);
      toast.success('Profile updated!');
      setForm({ ...form, password: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '600px' }}>
      <h2 className="fw-bold mb-4">My Profile</h2>

      <div className="bg-white rounded-3 p-4 border mb-4">
        <div className="d-flex align-items-center gap-3 mb-4">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
            style={{ width: '64px', height: '64px', background: '#f90', fontSize: '1.5rem' }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h5 className="mb-0 fw-bold">{user?.name}</h5>
            <span className={`badge ${user?.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
              {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <hr />
          <p className="text-muted small">Leave password blank to keep current password</p>
          <div className="mb-3">
            <label className="form-label fw-bold">New Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              placeholder="New password (optional)"
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
            />
          </div>
          <button type="submit" className="btn btn-warning fw-bold px-4" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
