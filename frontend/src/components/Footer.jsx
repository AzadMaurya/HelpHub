import React from "react";

export default function Footer() {
  return (
    <>
      <footer className="helphub-footer">
        <div className="footer-container">

          {/* Brand */}
          <div className="footer-brand">
            <h2>
              <span className="brand-help">Help</span>
              <span className="brand-hub">Hub</span>
            </h2>
            <p>
              Connecting donors, volunteers and NGOs to real-time verified crises.
              Small help. Big impact.
            </p>
          </div>

          {/* Links */}
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li>Home</li>
              <li>Crisis Feed</li>
              <li>Report Crisis</li>
              <li>Dashboard</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-contact">
            <h4>Contact</h4>
            <p>Email: support@helphub.org</p>
            <p>Phone: +91 98765 43210</p>
            <p>Lucknow, India</p>
          </div>

          {/* Dummy Payment Info (as you asked earlier) */}
          <div className="footer-payment">
            <h4>Support via</h4>
            <p>Bank: State Bank of India</p>
            <p>A/C: 1234 5678 9012</p>
            <p>IFSC: SBIN0001234</p>
            <p>UPI: helphub@sbi</p>
          </div>

        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} HelpHub • All Rights Reserved
        </div>
      </footer>

      <style>{`
        .helphub-footer {
          background: #0b0f19;
          color: #dcdcdc;
          padding: 60px 8% 20px;
          font-family: 'Segoe UI', sans-serif;
        }

        .footer-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 40px;
        }

        .footer-brand h2 {
          margin-bottom: 15px;
        }

        .brand-help {
          font-family: cursive;
          color: #1e88ff;
          font-size: 32px;
        }

        .brand-hub {
          color: #ffffff;
          font-size: 32px;
          font-weight: 500;
        }

        .footer-brand p {
          font-size: 14px;
          line-height: 1.6;
          color: #a0a0a0;
        }

        .footer-links h4,
        .footer-contact h4,
        .footer-payment h4 {
          color: #ffffff;
          margin-bottom: 15px;
          font-size: 16px;
        }

        .footer-links ul {
          list-style: none;
          padding: 0;
        }

        .footer-links li {
          margin-bottom: 8px;
          cursor: pointer;
          color: #b0b0b0;
          transition: 0.3s;
        }

        .footer-links li:hover {
          color: #1e88ff;
        }

        .footer-contact p,
        .footer-payment p {
          font-size: 14px;
          margin: 6px 0;
          color: #b0b0b0;
        }

        .footer-bottom {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #222;
          font-size: 13px;
          color: #888;
        }
      `}</style>
    </>
  );
}