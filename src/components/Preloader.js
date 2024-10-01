import React from 'react';
import './styles/Preloader.css';

const Preloader = () => {
  return (
    <div className="pg-preloader">
      <div className="pg-spinner">
        <img src={process.env.PUBLIC_URL + '/assets/logo.png'} alt="Premium Gear Logo" className="pg-logo"/>
      </div>
    </div>
  );
};

export default Preloader;
