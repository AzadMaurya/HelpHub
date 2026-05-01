import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReportCrisis = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'food',
    otherCategory: '',
    location: '',
    peopleCount: 1
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleDetectLocation = () => {
    setLocLoading(true);
    setError('');

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      setLocLoading(false);
      return;
    }

    const options = { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          if (data && data.address) {
            const sector = data.address.suburb || data.address.neighbourhood || data.address.residential || "";
            const city = data.address.city || data.address.town || data.address.district || "";
            const state = data.address.state || "";
            const pincode = data.address.postcode || "";
            const preciseAddress = `${sector ? sector + ', ' : ''}${city}, ${pincode}, ${state}`;
            setFormData(prev => ({ ...prev, location: preciseAddress }));
          } else {
            setFormData(prev => ({ ...prev, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
          }
        } catch {
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

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to report a crisis.');
        setLoading(false);
        return;
      }

      const data = new FormData();
      const finalCategory = formData.category === 'other' ? formData.otherCategory : formData.category;

      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', finalCategory);
      data.append('location', formData.location);
      data.append('peopleCount', formData.peopleCount);
      if (image) data.append('image', image);

      await axios.post(`${import.meta.env.VITE_API_URL}/crisis`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      navigate('/crises');
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="report-page">
      <div className="report-wrapper">
        <h1 className="report-title">Report a Crisis</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="report-form">
          <div className="grid-2">
            <div>
              <label>Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div>
              <label>People Affected</label>
              <input type="number" name="peopleCount" min="1" value={formData.peopleCount} onChange={handleChange} required />
            </div>
          </div>

          <label>Description</label>
          <textarea name="description" rows="4" value={formData.description} onChange={handleChange} required />

          <div className="grid-2">
            <div>
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="food">Food</option>
                <option value="medical">Medical</option>
                <option value="blood">Blood</option>
                <option value="shelter">Shelter</option>
                <option value="rescue">Rescue</option>
                <option value="fire">Fire</option>
                <option value="other">Other</option>
              </select>
            </div>

            {formData.category === 'other' && (
              <div>
                <label>Specify Category</label>
                <input type="text" name="otherCategory" value={formData.otherCategory} onChange={handleChange} required />
              </div>
            )}
          </div>

          <label>Location</label>
          <div className="location-row">
            <input type="text" name="location" value={formData.location} onChange={handleChange} required />
            <button type="button" onClick={handleDetectLocation} disabled={locLoading}>
              {locLoading ? 'Detecting...' : 'Detect'}
            </button>
          </div>

          <label>Proof Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} required />

          <button className="submit-btn" disabled={loading}>
            {loading ? 'Processing...' : 'Dispatch Report'}
          </button>
        </form>
      </div>

      <style>{`
        .report-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #ffffff, #ffffff);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .report-wrapper {
          background: #ffffff;
          width: 100%;
          max-width: 900px;
          border-radius: 14px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }

        .report-title {
          text-align: center;
          margin-bottom: 30px;
          font-weight: 700;
        }

        .report-form label {
          font-weight: 600;
          margin-top: 15px;
          display: block;
        }

        .report-form input,
        .report-form textarea,
        .report-form select {
          width: 100%;
          padding: 10px 12px;
          margin-top: 6px;
          border-radius: 6px;
          border: 1px solid #ccc;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .location-row {
          display: flex;
          gap: 10px;
          margin-top: 6px;
        }

        .location-row button {
          padding: 10px 16px;
          border: none;
          background: #2563eb;
          color: white;
          border-radius: 6px;
        }

        .submit-btn {
          margin-top: 25px;
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 8px;
          background: #dc2626;
          color: white;
          font-weight: 700;
          font-size: 16px;
        }

        @media (max-width: 768px) {
          .grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportCrisis;