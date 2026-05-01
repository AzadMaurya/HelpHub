import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user', 
    phone: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false); // For GPS button
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Precise Location Logic
  const handleDetectLocation = () => {
    setLocLoading(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      setLocLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.district || "Lucknow";
            const state = data.address.state || "Uttar Pradesh";
            const pincode = data.address.postcode || "";

            const fullAddress = `${city}, ${pincode}, ${state}`;
            setFormData(prev => ({ ...prev, location: fullAddress }));
          }
        } catch (err) {
          setFormData(prev => ({ ...prev, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
        }
        setLocLoading(false);
      },
      (err) => {
        alert("Location Error: " + err.message);
        setLocLoading(false);
      },
      options
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Extra validation check
    if (!formData.location) {
      setError('Location is mandatory for area-based notifications.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, formData);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role
      }));

      setLoading(false);
      navigate(data.role === 'admin' ? '/admin-dashboard' : '/crises');
      window.location.reload(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5 mb-5">
      <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: '550px' }}>
        <h2 className="text-center mb-4 fw-bold">Join Social Hub</h2>
        
        {error && <div className="alert alert-danger shadow-sm">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Full Name <span className="text-danger">*</span></label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Email address <span className="text-danger">*</span></label>
            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Password <span className="text-danger">*</span></label>
            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required minLength="6" />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">I want to register as a: <span className="text-danger">*</span></label>
            <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
              <option value="user">Standard User (Report Crises)</option>
              <option value="volunteer">Volunteer (Help Resolve Crises)</option>
              <option value="NGO">NGO (Manage Resources)</option>
            </select>
          </div>

          <div className="row mb-4">
            <div className="col-md-6 mb-3 mb-md-0">
              <label className="form-label fw-bold">Phone <span className="text-danger">*</span></label>
              <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Mobile number" />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Location <span className="text-danger">*</span></label>
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  required 
                  placeholder="City, Pincode" 
                />
                <button 
                  className="btn btn-outline-primary" 
                  type="button" 
                  onClick={handleDetectLocation}
                  disabled={locLoading}
                >
                  {locLoading ? <span className="spinner-border spinner-border-sm"></span> : '📍'}
                </button>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" disabled={loading}>
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="text-center mt-3">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;