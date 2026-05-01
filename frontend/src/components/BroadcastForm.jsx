import React, { useState } from 'react';
import axios from 'axios';

const BroadcastForm = () => {
  const [data, setData] = useState({ location: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/admin/broadcast`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', msg: res.data.message });
      setData({ location: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'danger', msg: err.response?.data?.message || 'Failed to send emails' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-dark text-white p-3">
        <h5 className="mb-0"><i className="bi bi-megaphone-fill me-2"></i>Area Broadcast Center</h5>
      </div>
      <div className="card-body p-4">
        <p className="text-muted small mb-4">Send urgent email alerts to all registered users in a specific city or area.</p>
        
        {status.msg && (
          <div className={`alert alert-${status.type} alert-dismissible fade show`} role="alert">
            {status.msg}
            <button type="button" className="btn-close" onClick={() => setStatus({ type: '', msg: '' })}></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Target Location</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g., Delhi" 
                value={data.location}
                onChange={(e) => setData({...data, location: e.target.value})}
                required 
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Subject Line</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Urgent Update" 
                value={data.subject}
                onChange={(e) => setData({...data, subject: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Message Content</label>
            <textarea 
              className="form-control" 
              rows="5" 
              placeholder="Enter the alert details here..."
              value={data.message}
              onChange={(e) => setData({...data, message: e.target.value})}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary px-4 fw-bold" disabled={loading}>
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2"></span>Sending...</>
            ) : (
              <><i className="bi bi-send-fill me-2"></i>Dispatch Broadcast</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BroadcastForm;