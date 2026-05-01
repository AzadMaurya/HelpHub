import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import BroadcastForm from '../components/BroadcastForm'; // Import the new UI

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [crises, setCrises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const fetchCrises = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/crisis`);
      setCrises(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch platform data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin' || !token) {
      navigate('/login');
      return;
    }
    fetchCrises();
  }, [navigate, user, token]);

  const handleVerify = async (id) => {
    if (!window.confirm('Are you sure you want to verify this crisis?')) return;
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/crisis/verify/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCrises();
    } catch (err) {
      alert(err.response?.data?.message || 'Verification failed');
    }
  };

  // ADDED: The Delete Function
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this false report?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/crisis/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCrises(crises.filter(crisis => crisis._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete report.');
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{height: '80vh'}}>
      <div className="spinner-grow text-primary" role="status"></div>
    </div>
  );

  const pendingCrises = crises.filter(c => c.status === 'pending');
  const verifiedCrises = crises.filter(c => c.status !== 'pending');

  return (
    <div className="container mt-4 pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark"><i className="bi bi-shield-lock-fill me-2 text-primary"></i>Admin Control Panel</h2>
        <div className="btn-group">
          <Link to="/manage-users" className="btn btn-outline-dark">Manage Users</Link>
          <button className="btn btn-primary" onClick={fetchCrises}><i className="bi bi-arrow-clockwise"></i></button>
        </div>
      </div>
      
      {error && <div className="alert alert-danger shadow-sm">{error}</div>}

      {/* Analytics Summary */}
      <div className="row mb-5 g-3">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-gradient-primary text-white" style={{background: 'linear-gradient(45deg, #0d6efd, #0dcaf0)'}}>
            <div className="card-body p-4">
              <h6 className="text-uppercase small fw-bold opacity-75">Total Reports</h6>
              <h2 className="display-6 fw-bold mb-0">{crises.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-gradient-warning" style={{background: 'linear-gradient(45deg, #ffc107, #ff9800)'}}>
            <div className="card-body p-4">
              <h6 className="text-uppercase small fw-bold opacity-75">Awaiting Action</h6>
              <h2 className="display-6 fw-bold mb-0">{pendingCrises.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-gradient-success text-white" style={{background: 'linear-gradient(45deg, #198754, #20c997)'}}>
            <div className="card-body p-4">
              <h6 className="text-uppercase small fw-bold opacity-75">Verified/Resolved</h6>
              <h2 className="display-6 fw-bold mb-0">{verifiedCrises.length}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Left Column: Broadcast UI */}
        <div className="col-lg-5 mb-4">
          <BroadcastForm />
        </div>

        {/* Right Column: Pending Crises */}
        <div className="col-lg-7 mb-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white p-3 border-bottom-0">
              <h5 className="mb-0 fw-bold"><i className="bi bi-clock-history me-2 text-warning"></i>Verification Queue</h5>
            </div>
            <div className="card-body p-0">
              {pendingCrises.length === 0 ? (
                <div className="p-5 text-center">
                  <i className="bi bi-check2-circle display-4 text-success mb-3"></i>
                  <p className="text-muted">All caught up! No reports are pending.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">
                    <thead className="bg-light">
                      <tr>
                        <th className="px-3 border-0">Title</th>
                        <th className="border-0">Urgency</th>
                        <th className="border-0 text-end px-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingCrises.map((crisis) => (
                        <tr key={crisis._id}>
                          <td className="px-3">
                            <div className="fw-bold text-truncate" style={{ maxWidth: '200px' }}>{crisis.title}</div>
                            <div className="small text-muted">{crisis.category} • {crisis.location}</div>
                          </td>
                          <td><StatusBadge type="urgency" value={crisis.urgency} /></td>
                          <td className="text-end px-3 text-nowrap">
                            <Link to={`/crisis/${crisis._id}`} className="btn btn-sm btn-light me-1">Review</Link>
                            <button className="btn btn-sm btn-success me-1" onClick={() => handleVerify(crisis._id)}>Approve</button>
                            {/* ADDED: Delete Button */}
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(crisis._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;