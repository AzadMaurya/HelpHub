import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const CrisisCard = ({ crisis }) => {
  return (
    <div className="card h-100 shadow-sm">
      {crisis.proof && (
        <img 
          src={crisis.proof} 
          className="card-img-top" 
          alt={crisis.title} 
          style={{ height: '200px', objectFit: 'cover' }} 
        />
      )}
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title text-truncate mb-0" style={{ maxWidth: '70%' }}>
            {crisis.title}
          </h5>
          <StatusBadge type="urgency" value={crisis.urgency} />
        </div>
        
        <p className="card-text text-muted small mb-3">
          <i className="bi bi-geo-alt-fill me-1"></i> {crisis.location} | {crisis.category.toUpperCase()}
        </p>
        
        <p className="card-text flex-grow-1">
          {crisis.description.substring(0, 80)}...
        </p>

        <div className="mt-auto border-top pt-3 d-flex justify-content-between align-items-center">
          <StatusBadge type="status" value={crisis.status} />
          <Link to={`/crisis/${crisis._id}`} className="btn btn-outline-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CrisisCard;