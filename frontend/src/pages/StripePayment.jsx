import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const StripePayment = () => {
  const navigate = useNavigate();
  const { crisisId } = useParams(); // Get ID from URL if coming from a specific crisis
  const [loading, setLoading] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      setLoading(false);
      alert('Payment Successful! Thank you for your donation.');
      navigate('/dashboard');
    }, 2500);
  };

  return (
    <div className="container py-5 mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            {/* Payment Header */}
            <div className="bg-primary p-4 text-white text-center">
              <h4 className="fw-bold mb-0">HelpHub Secure Pay</h4>
              <p className="small opacity-75 mb-0">Powered by Stripe Simulation</p>
            </div>

            <div className="card-body p-4">
              <form onSubmit={handlePayment}>
                {/* Amount */}
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted text-uppercase">Donation Amount</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">$</span>
                    <input type="number" className="form-control bg-light border-start-0 ps-0 fw-bold" placeholder="25.00" required />
                  </div>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted text-uppercase">Email Address</label>
                  <input type="email" className="form-control" placeholder="donor@example.com" required />
                </div>

                {/* Card Info (Stripe Layout) */}
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted text-uppercase">Card Information</label>
                  <div className="border rounded-2 p-3 bg-light">
                    <div className="d-flex align-items-center mb-2">
                      <input type="text" className="form-control border-0 bg-transparent p-0" placeholder="1234 5678 1234 5678" maxLength="16" required />
                      <i className="bi bi-credit-card text-muted fs-5 ms-2"></i>
                    </div>
                    <div className="row g-0 border-top pt-2 mt-2">
                      <div className="col-6 border-end pe-2">
                        <input type="text" className="form-control border-0 bg-transparent p-0" placeholder="MM / YY" maxLength="5" required />
                      </div>
                      <div className="col-6 ps-2">
                        <input type="text" className="form-control border-0 bg-transparent p-0" placeholder="CVC" maxLength="3" required />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary w-100 fw-bold py-3 rounded-3 position-relative"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processing...
                    </>
                  ) : (
                    "Pay with Card"
                  )}
                </button>

                <p className="text-center text-muted small mt-4">
                  <i className="bi bi-shield-lock-fill me-1"></i> 
                  This is a simulated secure payment environment.
                </p>
              </form>
            </div>
          </div>
          
          <div className="text-center mt-3">
            <button className="btn btn-link text-decoration-none text-muted" onClick={() => navigate(-1)}>
               Cancel and go back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripePayment;