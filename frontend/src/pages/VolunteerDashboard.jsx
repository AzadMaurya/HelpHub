import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const [assignedCrises, setAssignedCrises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const fetchMyAssignments = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/crisis`);
      // Filter crises where the assigned volunteer matches the logged-in user
      const myTasks = data.filter(c => c.assignedVolunteer?._id === user._id);
      setAssignedCrises(myTasks);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch your assignments.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || (user.role !== 'volunteer' && user.role !== 'NGO') || !token) {
      navigate('/login');
      return;
    }
    fetchMyAssignments();
  }, [navigate, user, token]);

  const handleComplete = async (id) => {
    if (!window.confirm('Mark this crisis as fully resolved?')) return;
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/crisis/complete/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMyAssignments(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  const inProgress = assignedCrises.filter(c => c.status === 'in-progress');
  const resolved = assignedCrises.filter(c => c.status === 'resolved');

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Volunteer Operations</h2>
        <Link to="/crises" className="btn btn-outline-primary fw-bold">Find Crises to Help</Link>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        {/* Active Assignments List */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-primary mb-4">
            <div className="card-header bg-primary text-white fw-bold">
              My Active Assignments ({inProgress.length})
            </div>
            <div className="card-body p-0">
              {inProgress.length === 0 ? (
                <div className="p-4 text-center text-muted">You have no active assignments right now.</div>
              ) : (
                <div className="list-group list-group-flush">
                  {inProgress.map((crisis) => (
                    <div key={crisis._id} className="list-group-item p-3">
                      <div className="d-flex w-100 justify-content-between mb-2">
                        <h5 className="mb-1 fw-bold">{crisis.title}</h5>
                        <StatusBadge type="urgency" value={crisis.urgency} />
                      </div>
                      <p className="mb-1 text-muted small">
                        <i className="bi bi-geo-alt-fill me-1"></i>{crisis.location} | <i className="bi bi-people-fill mx-1"></i>{crisis.peopleCount} Affected
                      </p>
                      <div className="mt-3">
                        <Link to={`/crisis/${crisis._id}`} className="btn btn-sm btn-outline-secondary me-2">View Details</Link>
                        <button className="btn btn-sm btn-dark" onClick={() => handleComplete(crisis._id)}>Mark Resolved</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resolved History Sidebar */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-light fw-bold text-success">
              Successfully Resolved ({resolved.length})
            </div>
            <div className="card-body p-0">
              {resolved.length === 0 ? (
                 <div className="p-4 text-center text-muted small">Your resolved crises will appear here.</div>
              ) : (
                <ul className="list-group list-group-flush">
                  {resolved.map(crisis => (
                    <li key={crisis._id} className="list-group-item text-truncate small">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      {crisis.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;