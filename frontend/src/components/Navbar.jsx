import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || null; 

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">

        {/* HelpHub Styled Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <span
            style={{
              fontFamily: 'cursive',
              fontSize: '2rem',
              color: '#0d6efd',   // blue
              letterSpacing: '1px',
              marginRight: '4px'
            }}
          >
            Help
          </span>
          <span
            style={{
              fontSize: '1.8rem',
              color: '#ffffff',   // white
              fontWeight: '600',
              letterSpacing: '1px'
            }}
          >
            Hub
          </span>
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/crises">Crisis Feed</Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/report-crisis">Report Crisis</Link>
              </li>
            )}
          </ul>
          
          <ul className="navbar-nav align-items-center">
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary ms-2" to="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-3">
                   <NotificationBell />
                </li>

                <li className="nav-item dropdown">
                  <span 
                    className="nav-link dropdown-toggle text-white" 
                    id="navbarDropdown" 
                    role="button" 
                    data-bs-toggle="dropdown"
                    style={{ cursor: 'pointer' }}
                  >
                    {user.name} ({user.role})
                  </span>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><Link className="dropdown-item" to="/dashboard">Dashboard</Link></li>
                    
                    {user.role === 'admin' && (
                      <>
                        <li><Link className="dropdown-item" to="/admin-dashboard">Admin Panel</Link></li>
                        <li><Link className="dropdown-item" to="/manage-users">Manage Users</Link></li>
                      </>
                    )}
                    {(user.role === 'volunteer' || user.role === 'NGO') && (
                      <li><Link className="dropdown-item" to="/volunteer-dashboard">Volunteer Panel</Link></li>
                    )}
                    
                    <li><Link className="dropdown-item" to="/profile">My Profile</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;