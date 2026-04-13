import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getAllUsers, deleteUser, updateUserRole } from '../../api/users';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    getAllUsers()
      .then((res) => setUsers(res.data.users))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, name) => {
    if (id === currentUser._id) {
      toast.error("You can't delete yourself");
      return;
    }
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const handleRoleChange = async (id, role) => {
    if (id === currentUser._id) {
      toast.error("You can't change your own role");
      return;
    }
    try {
      await updateUserRole(id, role);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    }
  };

  return (
    <AdminLayout>
      <h3 className="fw-bold mb-4">All Users ({users.length})</h3>

      {loading ? <Loader /> : (
        <div className="bg-white rounded-3 border">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                          style={{ width: '36px', height: '36px', background: '#f90', fontSize: '0.9rem', flexShrink: 0 }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="fw-bold">{user.name}</span>
                        {user._id === currentUser._id && (
                          <span className="badge bg-info">You</span>
                        )}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        className="form-select form-select-sm w-auto"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        disabled={user._id === currentUser._id}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(user._id, user.name)}
                        disabled={user._id === currentUser._id}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
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

export default AdminUsers;
