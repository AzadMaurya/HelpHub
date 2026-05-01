import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CrisisCard from '../components/CrisisCard';

const CrisisFeed = () => {
  const [crises, setCrises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // STEP 10: Filter States
  const [category, setCategory] = useState('');
  const [urgency, setUrgency] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchCrises = async () => {
      try {
        // Using Vite's environment variable syntax
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/crisis`);
        setCrises(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch crises. Make sure your backend is running.');
        setLoading(false);
      }
    };

    fetchCrises();
  }, []);

  // Filter Logic
  const filteredCrises = crises.filter((crisis) => {
    const matchCategory = category ? crisis.category === category : true;
    const matchUrgency = urgency ? crisis.urgency === urgency : true;
    const matchStatus = status ? crisis.status === status : true;
    const matchLocation = location ? crisis.location.toLowerCase().includes(location.toLowerCase()) : true;
    
    return matchCategory && matchUrgency && matchStatus && matchLocation;
  });

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container">
      <h2 className="mb-4 fw-bold">Active Crises</h2>

      {/* Filters Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                <option value="food">Food</option>
                <option value="medical">Medical</option>
                <option value="blood">Blood</option>
                <option value="shelter">Shelter</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                <option value="">All Urgency Levels</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>
            <div className="col-md-3">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search Location..." 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Crisis Grid */}
      <div className="row g-4">
        {filteredCrises.length === 0 ? (
          <div className="col-12 text-center text-muted">No crises found matching your filters.</div>
        ) : (
          filteredCrises.map((crisis) => (
            <div key={crisis._id} className="col-12 col-md-6 col-lg-4">
              <CrisisCard crisis={crisis} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CrisisFeed;