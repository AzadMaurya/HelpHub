import React from 'react';

const StatusBadge = ({ type, value }) => {
  const getColor = () => {
    if (type === 'urgency') {
      switch (value) {
        case 'high': return 'bg-danger';
        case 'medium': return 'bg-warning text-dark';
        case 'low': return 'bg-info text-dark';
        default: return 'bg-secondary';
      }
    }
    if (type === 'status') {
      switch (value) {
        case 'verified': return 'bg-success';
        case 'pending': return 'bg-secondary';
        case 'in-progress': return 'bg-primary';
        case 'resolved': return 'bg-dark';
        case 'rejected': return 'bg-danger';
        default: return 'bg-secondary';
      }
    }
    return 'bg-secondary';
  };

  return (
    <span className={`badge ${getColor()} me-2`}>
      {value.toUpperCase()}
    </span>
  );
};

export default StatusBadge;