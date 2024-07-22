import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import MainMenu from './components/MainMenu';
import ThreeDModel from './components/ThreeDModel';

const App = () => {
  const [isMenuActive, setMenuActive] = useState(false);
  const [activeColor, setActiveColor] = useState('#ffffff'); // Standardfarbe auf weiß gesetzt
  const [hoverColor, setHoverColor] = useState(null);

  const handleMenuToggle = (isActive) => {
    setMenuActive(isActive);
  };

  const handleColorChange = (color) => {
    setActiveColor(color);
    document.documentElement.style.setProperty('--active-outline-color', color);
  };

  return (
    <div className={`App ${isMenuActive ? 'menu-active' : ''}`} style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <ThreeDModel color={hoverColor || activeColor} isMenuActive={isMenuActive} />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header isMenuActive={isMenuActive} activeColor={activeColor} />
        <MainMenu 
          onMenuToggle={handleMenuToggle} 
          onColorChange={handleColorChange} 
          setActiveColor={setActiveColor}
          setHoverColor={setHoverColor} 
        />
      </div>
    </div>
  );
};

export default App;
