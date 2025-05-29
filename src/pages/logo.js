import React from 'react';
import logo from '../assets/logoapp.jpg'; // adapte le chemin si besoin

const Logo = ({ size = 150 }) => {
  return (
    <img
      src={logo}
      alt="Logo OpenShelf BEAC"
      style={{ width: size, height: 'auto' }}
    />
  );
};

export default Logo;