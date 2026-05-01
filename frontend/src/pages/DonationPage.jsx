import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Donate = () => {
  const navigate = useNavigate();
  const { crisisId } = useParams(); // Get crisis ID from URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    donationType: 'money', 
    itemDescription: '',   
    amount: '500',         
    customAmount: '',
    paymentMethod: 'upi',  
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [proofImage, setProofImage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setProofImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const finalAmount = formData.amount === 'custom' ? formData.customAmount : formData.amount;

    // Validation
    if (formData.donationType === 'money' && !finalAmount) {
      setError('Please select or enter a donation amount.');
      setLoading(false);
      return;
    }
    
    // Redirect to Stripe if Card is selected
    if (formData.donationType === 'money' && formData.paymentMethod === 'card') {
      navigate(`/stripe-payment/${crisisId || 'general'}`);
      return;
    }

    try {
      // Logic for UPI / Physical Items
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      
      if (formData.donationType === 'money') {
        data.append('finalAmount', finalAmount);
      }
      
      if (proofImage) {
        data.append('proofImage', proofImage);
      }

      // await axios.post(`${import.meta.env.VITE_API_URL}/donate`, data);
      
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mt-5 text-center">
        <div className="card shadow-sm p-5 mx-auto border-0 rounded-4" style={{ maxWidth: '600px' }}>
          <i className="bi bi-patch-check-fill text-success" style={{ fontSize: '4rem' }}></i>
          <h2 className="mt-3 fw-bold">Thank You, {formData.name || 'Hero'}!</h2>
          <p className="lead text-muted small">Your {formData.donationType} donation has been recorded. Our team will verify the proof and update the crisis status shortly.</p>
          <button className="btn btn-dark mt-3 rounded-pill px-4" onClick={() => navigate('/crises')}>Back to Feed</button>
        </div>
      </div>
    );
  }

  const getDonationLabel = (type) => {
    const labels = { money: '₹ Money', food: '🍱 Food', medical: '🏥 Medical', clothes: '👕 Clothes', other: '📦 Other' };
    return labels[type] || type;
  };

  return (
    <div className="container my-5">
      <div className="row g-5 align-items-center">
        
        {/* LEFT COLUMN: Impact Info */}
        <div className="col-lg-5">
          <span className="badge bg-primary px-3 py-2 mb-3 rounded-pill">HelpHub Support</span>
          <h1 className="display-5 fw-bold lh-1 mb-4">Your Kindness <span className="text-primary">Saves Lives.</span></h1>
          <p className="lead text-muted mb-4 small">
            Your contributions directly reach verified crises. Every rupee or item donated helps a family in need.
          </p>
          
          <div className="card border-0 bg-light p-3 mb-4 rounded-4">
             <div className="d-flex align-items-center mb-3">
               <div className="bg-white p-2 rounded-3 shadow-sm me-3">
                 <i className="bi bi-shield-lock text-primary fs-4"></i>
               </div>
               <div>
                 <h6 className="fw-bold mb-0">Secure & Verified</h6>
                 <p className="text-muted small mb-0">Every donation proof is manually reviewed by admins.</p>
               </div>
             </div>
             <div className="d-flex align-items-center">
               <div className="bg-white p-2 rounded-3 shadow-sm me-3">
                 <i className="bi bi-heart-pulse text-danger fs-4"></i>
               </div>
               <div>
                 <h6 className="fw-bold mb-0">Direct Impact</h6>
                 <p className="text-muted small mb-0">Supplies are dispatched to the crisis location immediately.</p>
               </div>
             </div>
          </div>

          <img 
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800" 
            alt="Impact" 
            className="img-fluid rounded-4 shadow-sm grayscale-1" 
          />
        </div>

        {/* RIGHT COLUMN: Donation Form */}
        <div className="col-lg-7">
          <div className="card shadow-lg border-0 rounded-4 p-2 p-md-4">
            <div className="card-body">
              <h3 className="fw-bold mb-4">Initiate Donation</h3>
              
              {error && <div className="alert alert-danger rounded-3 small">{error}</div>}

              <form onSubmit={handleSubmit}>
                
                {/* 1. Donation Type */}
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted text-uppercase">What are you donating?</label>
                  <div className="d-flex flex-wrap gap-2">
                    {['money', 'food', 'medical', 'clothes', 'other'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`btn ${formData.donationType === type ? 'btn-primary' : 'btn-outline-secondary'} rounded-pill px-3`}
                        onClick={() => setFormData({ ...formData, donationType: type, itemDescription: '' })}
                      >
                        {getDonationLabel(type)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2A. Item Details */}
                {formData.donationType !== 'money' && (
                  <div className="p-3 bg-light rounded-4 mb-4 border border-dashed">
                    <label className="form-label fw-bold">Items Details <span className="text-danger">*</span></label>
                    <textarea 
                      className="form-control border-0 bg-white" 
                      name="itemDescription" 
                      rows="3"
                      value={formData.itemDescription}
                      onChange={handleChange} 
                      required 
                      placeholder="e.g., 20kg Rice, 10 Winter Jackets..."
                    ></textarea>
                  </div>
                )}

                {/* 2B. Money Details */}
                {formData.donationType === 'money' && (
                  <div className="p-4 bg-light rounded-4 mb-4 border">
                    <label className="form-label fw-bold mb-3">Donation Amount (₹)</label>
                    <div className="d-flex gap-2 mb-3">
                      {['500', '1000', '5000', 'custom'].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          className={`btn ${formData.amount === amt ? 'btn-dark' : 'btn-white border'} flex-grow-1 shadow-sm`}
                          onClick={() => setFormData({ ...formData, amount: amt })}
                        >
                          {amt === 'custom' ? 'Other' : `₹${amt}`}
                        </button>
                      ))}
                    </div>
                    
                    {formData.amount === 'custom' && (
                      <input type="number" className="form-control mb-3" name="customAmount" placeholder="Enter amount" onChange={handleChange} required />
                    )}

                    <label className="form-label small fw-bold text-muted text-uppercase mt-2">Payment Method</label>
                    <select className="form-select border-0 shadow-sm mb-2" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                      <option value="upi">UPI (Scan & Pay)</option>
                      <option value="card">Credit / Debit Card (Stripe)</option>
                      <option value="bank">Net Banking</option>
                    </select>
                    {formData.paymentMethod === 'card' && (
                       <div className="alert alert-info py-2 small mt-2 border-0">
                         <i className="bi bi-info-circle me-2"></i> You will be redirected to our secure Stripe portal.
                       </div>
                    )}
                  </div>
                )}

                {/* 3. Donor Info */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Name</label>
                    <input type="text" className="form-control bg-light" name="name" onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Phone</label>
                    <input type="text" className="form-control bg-light" name="phone" onChange={handleChange} required />
                  </div>
                </div>

                {/* 4. Proof Upload */}
                <div className="mb-4">
                  <label className="form-label small fw-bold">Upload Proof (Image)</label>
                  <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} required={formData.paymentMethod !== 'card'} />
                  <small className="text-muted">Required for UPI/Item donations for verification.</small>
                </div>

                <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow" disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm"></span> : (formData.paymentMethod === 'card' ? 'Proceed to Payment' : 'Submit Donation')}
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>


     {/* PAYMENT DETAILS SECTION */}
<div className="container mt-5 mb-5">
  <div className="card border-0 shadow-sm rounded-4 p-4 bg-light">
    <h5 className="fw-bold mb-4 text-center">Payment Details for Demo (SocialHub)</h5>

    <div className="row text-center g-4">

      {/* Bank Details */}
      <div className="col-md-4">
        <div className="p-3 bg-white rounded-4 shadow-sm h-100">
          <i className="bi bi-bank fs-2 text-primary"></i>
          <h6 className="fw-bold mt-2">Bank Transfer / Net Banking</h6>
          <p className="small text-muted mb-1">Account Name: SocialHub Relief</p>
          <p className="small text-muted mb-1">Account No: 123456789012</p>
          <p className="small text-muted mb-1">IFSC: SBIN0001234</p>
          <p className="small text-muted">Bank: State Bank of India</p>
        </div>
      </div>

      {/* UPI Details */}
      <div className="col-md-4">
        <div className="p-3 bg-white rounded-4 shadow-sm h-100">
          <i className="bi bi-qr-code fs-2 text-success"></i>
          <h6 className="fw-bold mt-2">UPI Payment</h6>
          <p className="small text-muted mb-1">UPI ID: socialhub@upi</p>
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=socialhub@upi"
            alt="UPI QR"
            className="img-fluid mt-2"
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="col-md-4">
        <div className="p-3 bg-white rounded-4 shadow-sm h-100">
          <i className="bi bi-info-circle fs-2 text-danger"></i>
          <h6 className="fw-bold mt-2">Instructions</h6>
          <p className="small text-muted">
            After completing the payment via UPI or Net Banking, upload the payment screenshot above as proof for verification.
          </p>
        </div>
      </div>

    </div>
  </div>
</div>


    </div>
  );
};

export default Donate;