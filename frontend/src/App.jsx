import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { io } from 'socket.io-client';
import Navbar from './components/Navbar';

// Import your pages...
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CrisisFeed from './pages/CrisisFeed';
import ReportCrisis from './pages/ReportCrisis';
import CrisisDetails from './pages/CrisisDetails';
import DonationPage from './pages/DonationPage';
import VolunteerDashboard from './pages/VolunteerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import Profile from './pages/Profile';
import Footer from './components/Footer';

function App() {

  useEffect(() => {
    // 1. Request Browser Notification Permission on Mount
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    
const socket = io(import.meta.env.VITE_API_URL, {
  transports: ['websocket', 'polling'],
  withCredentials: true
});

    socket.on('new_crisis', (crisis) => {
      // 2. SHOW IN-APP TOAST (What we had before)
      toast.custom((t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'} shadow-lg rounded-3 bg-white border border-light`}
          style={{ pointerEvents: 'auto', minWidth: '320px', cursor: 'pointer', display: 'flex', overflow: 'hidden' }}
          onClick={() => {
            toast.dismiss(t.id);
            window.location.href = `/crisis/${crisis._id}`;
          }}
        >
          <div className="bg-danger" style={{ width: '5px' }}></div>
          <div className="p-3 d-flex align-items-start w-100">
            <div className="me-3 mt-1 position-relative">
              <i className="bi bi-bell-fill fs-4 text-warning"></i>
            </div>
            <div className="flex-grow-1">
              <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '0.85rem', textTransform: 'uppercase' }}>New {crisis.category} Alert</h6>
              <p className="mb-1 small text-dark text-truncate" style={{ maxWidth: '220px' }}>{crisis.title}</p>
            </div>
          </div>
        </div>
      ), { duration: 6000, position: 'top-right' });

      // 3. SHOW SYSTEM NOTIFICATION (Outside the browser)
      if (Notification.permission === "granted") {
        const systemNotif = new Notification(`🚨 NEW CRISIS: ${crisis.category.toUpperCase()}`, {
          body: `${crisis.title} in ${crisis.location}`,
          icon: "/favicon.ico", // Or your project logo
          tag: crisis._id, // Prevents duplicate notifications for the same crisis
        });

        systemNotif.onclick = () => {
          window.focus();
          window.location.href = `/crisis/${crisis._id}`;
        };
      }
    });

    return () => socket.disconnect();
  }, []);

  return (
    <Router>
      <Toaster />
      <Navbar />
      <div className="container mt-4 mb-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/crises" element={<CrisisFeed />} />
          <Route path="/crisis/:id" element={<CrisisDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report-crisis" element={<ReportCrisis />} />
          <Route path="/donate/:crisisId" element={<DonationPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/manage-users" element={<ManageUsers />} />
        </Routes>
      </div>
      <Footer/>
    </Router>
  );
}

export default App;