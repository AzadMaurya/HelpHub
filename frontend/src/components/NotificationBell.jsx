import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Only connect socket if user is logged in
    if (!user) return;

    // Connect to the backend socket server
    const socket = io(import.meta.env.VITE_API_URL.replace('/api', ''));

    // Listen for New Crisis (Relevant for Admins, Volunteers, NGOs)
    socket.on('new_crisis', (crisis) => {
      if (user.role !== 'user') {
        addNotification({
          id: Date.now(),
          message: `New emergency reported: ${crisis.title}`,
          link: `/crisis/${crisis._id}`,
          time: new Date()
        });
      }
    });

    // Listen for Volunteer Assignment
    socket.on('volunteer_assigned', (crisis) => {
      // If the user is the one who created the crisis, notify them
      if (crisis.createdBy?._id === user._id) {
        addNotification({
          id: Date.now(),
          message: `A volunteer has been assigned to your crisis: ${crisis.title}`,
          link: `/crisis/${crisis._id}`,
          time: new Date()
        });
      }
    });

    // Listen for Crisis Resolution
    socket.on('crisis_resolved', (crisis) => {
      if (crisis.createdBy === user._id || user.role === 'admin') {
        addNotification({
          id: Date.now(),
          message: `Crisis marked as resolved: ${crisis.title}`,
          link: `/crisis/${crisis._id}`,
          time: new Date()
        });
      }
    });

    // Cleanup on unmount
    return () => socket.disconnect();
  }, [user]);

  const addNotification = (notif) => {
    setNotifications((prev) => [notif, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setUnreadCount(0); // Clear badge when opened
  };

  if (!user) return null;

  return (
    <div className="position-relative me-3">
      <button 
        className="btn btn-dark position-relative border-0" 
        onClick={handleOpen}
        style={{ background: 'transparent' }}
      >
        <i className="bi bi-bell-fill fs-5"></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          className="dropdown-menu dropdown-menu-end show shadow-lg p-0" 
          style={{ position: 'absolute', right: 0, top: '45px', width: '300px', zIndex: 1050 }}
        >
          <div className="bg-light px-3 py-2 border-bottom fw-bold text-dark d-flex justify-content-between">
            <span>Notifications</span>
            {notifications.length > 0 && (
              <span 
                className="text-primary small" 
                style={{ cursor: 'pointer' }}
                onClick={() => setNotifications([])}
              >
                Clear All
              </span>
            )}
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div className="p-3 text-center text-muted small">No new notifications</div>
            ) : (
              notifications.map((notif) => (
                <Link 
                  to={notif.link} 
                  key={notif.id} 
                  className="dropdown-item p-3 border-bottom text-wrap"
                  onClick={() => setIsOpen(false)}
                >
                  <p className="mb-1 small">{notif.message}</p>
                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                    {notif.time.toLocaleTimeString()}
                  </small>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;