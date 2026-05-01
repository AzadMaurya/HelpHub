import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';

const Dashboard = () => {
  const navigate = useNavigate();
  const [myCrises, setMyCrises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    const fetchMyCrises = async () => {
      try {
        // Fetch all crises and filter on the frontend for simplicity in this step
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/crisis`);
        const filteredCrises = data.filter(crisis => crisis.createdBy?._id === user._id);
        setMyCrises(filteredCrises);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch your dashboard data.');
        setLoading(false);
      }
    };

    fetchMyCrises();
  }, [navigate, user, token]);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container mt-4">
      <div className="row mb-4 align-items-center">
        <div className="col-md-8">
          <h2 className="fw-bold">Welcome, {user?.name}</h2>
          <p className="text-muted">Manage the crises you have reported here.</p>
        </div>
        <div className="col-md-4 text-md-end">
          <Link to="/report-crisis" className="btn btn-danger fw-bold">
            + Report New Emergency
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm">
        <div className="card-header bg-white fw-bold">
          My Reported Crises
        </div>
        <div className="card-body p-0">
          {myCrises.length === 0 ? (
            <div className="p-4 text-center text-muted">
              You haven't reported any crises yet.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Title</th>
                    <th>Date Reported</th>
                    <th>Urgency</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myCrises.map((crisis) => (
                    <tr key={crisis._id}>
                      <td className="fw-semibold text-truncate" style={{ maxWidth: '200px' }}>
                        {crisis.title}
                      </td>
                      <td>{new Date(crisis.createdAt).toLocaleDateString()}</td>
                      <td><StatusBadge type="urgency" value={crisis.urgency} /></td>
                      <td><StatusBadge type="status" value={crisis.status} /></td>
                      <td>
                        <Link to={`/crisis/${crisis._id}`} className="btn btn-sm btn-outline-primary">
                          View
                        </Link>
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
  );
};

export default Dashboard;