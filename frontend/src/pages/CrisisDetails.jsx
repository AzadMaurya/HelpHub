import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StatusBadge from '../components/StatusBadge';

const CrisisDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crisis, setCrisis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Get current user and token from local storage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const fetchCrisisDetails = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/crisis/${id}`);
      setCrisis(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch crisis details.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrisisDetails();
  }, [id]);

  // Admin Verification Action
  const handleVerify = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/crisis/verify/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCrisisDetails(); // Refresh data to show new status
    } catch (err) {
      alert(err.response?.data?.message || 'Verification failed');
    }
  };

  // Volunteer Assignment Action
  const handleAssign = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/crisis/assign/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCrisisDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Assignment failed');
    }
  };

  // Mark as Resolved Action
  const handleComplete = async () => {
     try {
      await axios.put(`${import.meta.env.VITE_API_URL}/crisis/complete/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCrisisDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Completion failed');
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!crisis) return <div className="alert alert-warning">Crisis not found.</div>;

  return (
    <div className="container mt-4">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        &larr; Back to Feed
      </button>

      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-sm mb-4">
            {crisis.proof && (
              <img 
                src={crisis.proof} 
                className="card-img-top" 
                alt="Crisis Proof" 
                style={{ maxHeight: '400px', objectFit: 'cover' }} 
              />
            )}
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="card-title fw-bold mb-0">{crisis.title}</h2>
                <div>
                  <StatusBadge type="urgency" value={crisis.urgency} />
                  <StatusBadge type="status" value={crisis.status} />
                </div>
              </div>
              
              <div className="text-muted mb-4">
                <span className="me-3"><i className="bi bi-geo-alt-fill"></i> {crisis.location}</span>
                <span className="me-3"><i className="bi bi-tags-fill"></i> {crisis.category.toUpperCase()}</span>
                <span><i className="bi bi-people-fill"></i> {crisis.peopleCount} People Affected</span>
              </div>

              <h5 className="fw-semibold">Description</h5>
              <p className="card-text" style={{ whiteSpace: 'pre-wrap' }}>{crisis.description}</p>
              
              <hr />
              
              <div className="d-flex justify-content-between text-muted small">
                <span>Reported by: {crisis.createdBy?.name || 'Unknown'}</span>
                <span>Date: {new Date(crisis.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          {/* Action Panel Based on User Role */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light fw-bold">
              Take Action
            </div>
            <div className="card-body">
              {!user ? (
                <div className="text-center">
                  <p>Please log in to volunteer or donate.</p>
                  <Link to="/login" className="btn btn-primary w-100">Login</Link>
                </div>
              ) : (
                <div className="d-grid gap-2">
                  {/* Any logged in user can donate */}
                  <Link to={`/donate/${crisis._id}`} className="btn btn-success fw-bold">
                    Donate Resources
                  </Link>

                  {/* Admin Controls */}
                  {user.role === 'admin' && crisis.status === 'pending' && (
                    <button className="btn btn-warning" onClick={handleVerify}>
                      Verify Crisis
                    </button>
                  )}

                  {/* Volunteer / NGO Controls */}
                  {(user.role === 'volunteer' || user.role === 'NGO') && crisis.status === 'verified' && (
                    <button className="btn btn-primary" onClick={handleAssign}>
                      Assign to Me
                    </button>
                  )}

                  {/* Completion Control */}
                  {crisis.assignedVolunteer?._id === user._id && crisis.status === 'in-progress' && (
                    <button className="btn btn-dark" onClick={handleComplete}>
                      Mark as Resolved
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Assignment Info Panel */}
          {crisis.assignedVolunteer && (
            <div className="card shadow-sm border-info">
              <div className="card-body text-info">
                <h6 className="fw-bold"><i className="bi bi-person-badge"></i> Assigned To</h6>
                <p className="mb-0">{crisis.assignedVolunteer.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrisisDetails;