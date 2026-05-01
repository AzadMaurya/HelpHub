import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from local storage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  if (!user) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-sm w-100" style={{ maxWidth: '600px' }}>
        <div className="card-header bg-dark text-white fw-bold text-center py-3">
          My Profile
        </div>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <div 
              className="bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3"
              style={{ width: '80px', height: '80px', fontSize: '2rem', fontWeight: 'bold' }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="fw-bold mb-0">{user.name}</h3>
            <span className="badge bg-secondary mt-2 px-3 py-2 text-uppercase">{user.role}</span>
          </div>

          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex justify-content-between align-items-center py-3">
              <span className="fw-semibold text-muted">Email Address</span>
              <span>{user.email}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center py-3">
              <span className="fw-semibold text-muted">Account ID</span>
              <span className="text-monospace small">{user._id}</span>
            </li>
          </ul>

          <div className="text-center mt-4">
            <button 
              className="btn btn-outline-danger w-100 fw-bold"
              onClick={() => {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                navigate('/login');
                window.location.reload();
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;