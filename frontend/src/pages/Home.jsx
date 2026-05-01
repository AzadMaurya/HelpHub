import React from "react";
import { Link } from "react-router-dom";

// Assets
import mainImg from "../assets/main.png";
import crisis1 from "../assets/crisis1.jpg";
import crisis2 from "../assets/crisis2.png";
import crisis3 from "../assets/crisis3.jpg";

const Home = () => {
  return (
    <>
      {/* ================= HERO CAROUSEL ================= */}
      <div id="crisisCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {[crisis1, crisis2, crisis3].map((img, i) => (
            <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
              <div className="carousel-overlay"></div>
              <img src={img} className="d-block w-100 carousel-img" alt="Relief effort" />
              <div className="carousel-caption d-none d-md-block text-start pb-5">
                <h2 className="display-4 fw-bold">Humanity First.</h2>
                <p className="lead">Join a global network of verified responders.</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MAIN HERO SECTION ================= */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center gy-5">
            <div className="col-lg-6 text-center text-lg-start">
              <span className="badge bg-danger px-3 py-2 rounded-pill mb-3 animate-fade-in">
                Real-Time Crisis Response
              </span>
              <h1 className="display-4 fw-bold lh-sm mb-3">
                Connecting <span className="text-primary">Urgent Needs</span> With Immediate Action.
              </h1>
              <p className="lead text-muted mb-4 pe-lg-5">
                HelpHub is a decentralized community platform that bypasses bureaucracy to connect crisis victims directly with local volunteers and verified NGOs.
              </p>

              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <Link to="/crises" className="btn btn-primary btn-lg px-4 rounded-pill shadow">
                  Explore Active Crises
                </Link>
                <Link to="/report-crisis" className="btn btn-outline-danger btn-lg px-4 rounded-pill">
                  <i className="bi bi-megaphone me-2"></i>Report Emergency
                </Link>
              </div>
            </div>

            <div className="col-lg-6 text-center">
              <div className="hero-img-container">
                <img src={mainImg} alt="Coordination Hub" className="img-fluid hero-img" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY HELPHUB? (FEATURES) ================= */}
      <section className="features-section bg-light py-5 border-top">
        <div className="container py-lg-4">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold">Why Communities Trust HelpHub</h2>
            <div className="header-line bg-primary mx-auto"></div>
          </div>

          <div className="row g-4">
            {[
              {
                icon: "bi-lightning-charge",
                title: "Smart Urgency Triage",
                text: "Our system analyzes incoming reports to highlight life-threatening situations, ensuring responders act on high-priority crises first.",
                color: "bg-danger-subtle text-danger"
              },
              {
                icon: "bi-shield-check",
                title: "Verified Helper Network",
                text: "No more anonymous promises. We verify every NGO and high-impact volunteer to ensure resources are handled by trusted hands.",
                color: "bg-primary-subtle text-primary"
              },
              {
                icon: "bi-graph-up",
                title: "Live Impact Tracker",
                text: "Full transparency. Donors receive real-time updates and photographic proof as their contributions are deployed on the ground.",
                color: "bg-success-subtle text-success"
              }
            ].map((f, i) => (
              <div key={i} className="col-12 col-md-6 col-lg-4">
                <div className="feature-card h-100 p-4 border-0 shadow-sm rounded-4 bg-white transition-hover">
                  <div className={`feature-icon-box mb-4 rounded-3 ${f.color}`}>
                    <i className={`bi ${f.icon} fs-2`}></i>
                  </div>
                  <h4 className="fw-bold mb-3">{f.title}</h4>
                  <p className="text-muted small lh-lg">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS (PROCESS) ================= */}
      <section className="how-section py-5 bg-dark text-white overflow-hidden">
        <div className="container py-4">
          <h2 className="text-center fw-bold mb-5 display-6">From Crisis to Resolution</h2>
          
          <div className="row g-0 justify-content-center">
            {[
              { step: "01", title: "Report", desc: "A witness or victim submits a report with geolocation and required supplies." },
              { step: "02", title: "Verify", desc: "The platform community and moderators validate the urgency and authenticity." },
              { step: "03", title: "Mobilize", desc: "Nearby NGOs and donors claim the crisis, dispatching funds or physical goods." },
              { step: "04", title: "Resolve", desc: "The loop is closed with proof of impact, and the crisis is marked as resolved." }
            ].map((s, i) => (
              <div key={i} className="col-12 col-md-3 px-4 mb-5 mb-md-0 position-relative">
                <div className="text-center">
                  <div className="step-circle mb-3">{s.step}</div>
                  <h5 className="fw-bold mb-2">{s.title}</h5>
                  <p className="text-white-50 small">{s.desc}</p>
                </div>
                {i < 3 && <div className="d-none d-md-block step-connector"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="cta-section py-5">
        <div className="container">
          <div className="cta-box bg-primary text-white p-5 rounded-5 text-center shadow-lg">
            <h2 className="display-5 fw-bold mb-3">Ready to Make an Impact?</h2>
            <p className="lead mb-4 opacity-75">Join thousands of volunteers and organizations already saving lives.</p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/register" className="btn btn-light btn-lg px-5 rounded-pill fw-bold">
                Create Account
              </Link>
              <Link to="/about" className="btn btn-outline-light btn-lg px-5 rounded-pill">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STYLING ================= */}
      <style>{`
        /* Carousel Styling */
        .carousel-img {
          height: 65vh;
          object-fit: cover;
          filter: brightness(0.6);
        }
        .carousel-overlay {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7));
          z-index: 1;
        }

        /* Hero & General */
        .hero-section { padding: 80px 0; }
        .header-line { width: 60px; height: 4px; border-radius: 2px; }
        
        /* Feature Cards */
        .feature-icon-box {
          width: 60px; height: 60px;
          display: flex; align-items: center; justify-content: center;
        }
        .transition-hover { transition: all 0.3s ease; }
        .transition-hover:hover {
          transform: translateY(-10px);
          box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important;
        }

        /* How It Works (Steps) */
        .step-circle {
          width: 50px; height: 50px;
          line-height: 50px;
          border: 2px solid #0d6efd;
          border-radius: 50%;
          margin: 0 auto;
          font-weight: bold;
          color: #0d6efd;
        }
        .step-connector {
          position: absolute;
          top: 25px; left: 70%;
          width: 60%; height: 2px;
          background: rgba(255,255,255,0.1);
        }

        /* CTA */
        .cta-box {
          background: linear-gradient(135deg, #0d6efd 0%, #0043a8 100%);
        }

        @media (max-width: 768px) {
          .carousel-img { height: 45vh; }
          .hero-section { padding: 40px 0; }
          .step-connector { display: none; }
        }
      `}</style>
    </>
  );
};

export default Home;