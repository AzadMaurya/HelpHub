import React from "react";
import { Link } from "react-router-dom";

import mainImg from "../assets/main.png";
import crisis1 from "../assets/crisis1.jpg";
import crisis2 from "../assets/crisis2.png";
import crisis3 from "../assets/crisis3.jpg";

const Home = () => {
  return (
    <>
      {/* ================= CAROUSEL ================= */}
      <div id="crisisCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={crisis1} className="d-block w-100 carousel-img" alt="Relief work in India" />
          </div>
          <div className="carousel-item">
            <img src={crisis2} className="d-block w-100 carousel-img" alt="Community support" />
          </div>
          <div className="carousel-item">
            <img src={crisis3} className="d-block w-100 carousel-img" alt="Emergency medical aid" />
          </div>
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#crisisCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" />
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#crisisCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" />
        </button>
      </div>

      {/* ================= HERO ================= */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-3">
                Community-Led Crisis Response Platform
              </h1>
              <p className="lead mb-4">
                Report emergencies, prioritize critical needs, and connect instantly 
                with local volunteers and NGOs. Real-time coordination for faster, 
                more transparent disaster relief.
              </p>

              <Link to="/crises" className="btn btn-primary btn-lg me-3">
                View Active Crises
              </Link>
              <Link to="/report-crisis" className="btn btn-danger btn-lg">
                Report Emergency
              </Link>
            </div>

            <div className="col-lg-6 text-center">
              <img src={mainImg} alt="SocialHub Coordination" className="img-fluid hero-img" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features-section text-center">
        <div className="container">
          <h2 className="mb-5 fw-bold">Why HelpHub?</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="feature-card">
                <h4>Smart Urgency Triage</h4>
                <p>Our system analyzes crisis reports to highlight the most critical situations first.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <h4>Verified Helper Network</h4>
                <p>Directly link with trusted NGOs and volunteers on the ground for immediate impact.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <h4>Live Donation Tracker</h4>
                <p>Ensure every resource reaches its destination with end-to-end transparency.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="how-section">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">How It Works</h2>
          <div className="row text-center">
            <div className="col-md-3 step">
              <div className="step-icon">1</div>
              <h5>Report</h5>
              <p>Submit incident details and GPS location.</p>
            </div>
            <div className="col-md-3 step">
              <div className="step-icon">2</div>
              <h5>Analyze</h5>
              <p>Situations are categorized by severity and type.</p>
            </div>
            <div className="col-md-3 step">
              <div className="step-icon">3</div>
              <h5>Coordinate</h5>
              <p>Verified responders receive high-priority alerts.</p>
            </div>
            <div className="col-md-3 step">
              <div className="step-icon">4</div>
              <h5>Resolve</h5>
              <p>Monitor help in real-time until the crisis is closed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="cta-section text-center">
        <div className="container">
          <h2 className="fw-bold mb-3">Be Part of the Solution</h2>
          <p className="mb-4">Whether reporting a crisis or lending a hand, your contribution saves lives.</p>
          <Link to="/register" className="btn btn-light btn-lg px-5">
            Join the Network
          </Link>
        </div>
      </section>

      {/* ================= INTERNAL CSS ================= */}
      <style>{`
        .carousel-img {
          height: 75vh;
          object-fit: cover;
        }

        .hero-section {
          padding: 90px 0;
          background: linear-gradient(to right, #f8f9fa, #ffffff);
        }

        .hero-img {
          max-height: 420px;
        }

        .features-section {
          padding: 80px 0;
          background: #f8f9fa;
        }

        .feature-card {
          padding: 30px;
          border-radius: 10px;
          background: white;
          box-shadow: 0 5px 20px rgba(0,0,0,0.08);
          transition: 0.3s;
          height: 100%;
        }

        .feature-card:hover {
          transform: translateY(-8px);
        }

        .how-section {
          padding: 80px 0;
        }

        .step-icon {
          width: 50px;
          height: 50px;
          background: #0d6efd;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .step {
          padding: 20px;
        }

        .cta-section {
          padding: 80px 0;
          background: #0d6efd;
          color: white;
        }
      `}</style>
    </>
  );
};

export default Home;