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
          {[crisis1, crisis2, crisis3].map((img, i) => (
            <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
              <img src={img} className="d-block w-100 carousel-img" alt="Relief visual" />
            </div>
          ))}
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
          <div className="row align-items-center gy-5">
            <div className="col-lg-6 text-center text-lg-start">
              <h1 className="display-5 display-lg-4 fw-bold mb-3">
                Community-Led Crisis Response Platform
              </h1>
              <p className="lead mb-4">
                Report emergencies, prioritize critical needs, and connect instantly
                with local volunteers and NGOs.
              </p>

              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <Link to="/crises" className="btn btn-primary btn-lg">
                  View Active Crises
                </Link>
                <Link to="/report-crisis" className="btn btn-danger btn-lg">
                  Report Emergency
                </Link>
              </div>
            </div>

            <div className="col-lg-6 text-center">
              <img src={mainImg} alt="Coordination" className="img-fluid hero-img" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features-section text-center">
        <div className="container">
          <h2 className="mb-5 fw-bold">Why HelpHub?</h2>
          <div className="row g-4">
            {[
              {
                title: "Smart Urgency Triage",
                text: "Highlights the most critical situations first."
              },
              {
                title: "Verified Helper Network",
                text: "Connect with trusted NGOs and volunteers."
              },
              {
                title: "Live Donation Tracker",
                text: "Full transparency from donor to ground."
              }
            ].map((f, i) => (
              <div key={i} className="col-12 col-md-6 col-lg-4">
                <div className="feature-card h-100">
                  <h4>{f.title}</h4>
                  <p>{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="how-section">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">How It Works</h2>
          <div className="row text-center g-4">
            {["Report", "Analyze", "Coordinate", "Resolve"].map((step, i) => (
              <div key={i} className="col-6 col-md-3 step">
                <div className="step-icon">{i + 1}</div>
                <h5>{step}</h5>
                <p className="small">Quick, structured, real-time flow.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="cta-section text-center">
        <div className="container">
          <h2 className="fw-bold mb-3">Be Part of the Solution</h2>
          <p className="mb-4">Your contribution saves lives.</p>
          <Link to="/register" className="btn btn-light btn-lg px-5">
            Join the Network
          </Link>
        </div>
      </section>

      {/* ================= RESPONSIVE CSS ================= */}
      <style>{`
        .carousel-img {
          height: 75vh;
          object-fit: cover;
        }

        @media (max-width: 992px) {
          .carousel-img {
            height: 55vh;
          }
        }

        @media (max-width: 576px) {
          .carousel-img {
            height: 40vh;
          }
        }

        .hero-section {
          padding: 90px 0;
          background: linear-gradient(to right, #f8f9fa, #ffffff);
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 50px 0;
          }
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