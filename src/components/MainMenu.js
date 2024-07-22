import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import MenuItem from './MenuItem';

const MainMenu = ({ onMenuToggle, onColorChange, setActiveColor, setHoverColor }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [startX, setStartX] = useState(null);
  const appRef = useRef(null);

  useEffect(() => {
    appRef.current = document.querySelector('.App');
  }, []);

  const handleItemClick = (index, color) => {
    const newIndex = index === activeIndex ? null : index;
    setActiveIndex(newIndex);
    onMenuToggle(newIndex !== null);
    onColorChange(newIndex !== null ? color : null);
    setActiveColor(newIndex !== null ? color : null);
  };

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (startX === null) return;
    const currentX = e.touches[0].clientX;
    const diffX = startX - currentX;

    if (diffX > 50) {
      changeActiveMenu(activeIndex + 1);
      setStartX(null);
    } else if (diffX < -50) {
      changeActiveMenu(activeIndex - 1);
      setStartX(null);
    }
  };

  const handleTouchEnd = () => {
    setStartX(null);
  };

  const changeActiveMenu = (newIndex) => {
    if (newIndex < 0 || newIndex >= menuItems.length) return;
    const color = colors[newIndex];
    setActiveIndex(newIndex);
    onMenuToggle(true);
    onColorChange(color);
    setActiveColor(color);
  };

  const handleMouseEnter = (index) => {
    const color = colors[index];
    setHoverColor(color);
  };

  const handleMouseLeave = () => {
    setHoverColor(null);
  };

  const menuItems = ['Menu 1', 'Menu 2', 'Menu 3', 'Menu 4', 'Menu 5', 'Menu 6'];
  const colors = [
    "rgba(57, 255, 20, 1)",
    "rgba(0, 255, 255, 1)",
    "rgba(255, 7, 58, 1)",
    "rgba(255, 0, 255, 1)",
    "rgba(255, 255, 0, 1)",
    "rgba(0, 255, 0, 1)"
  ];

  return (
    <div
      className="main-menu"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {menuItems.map((title, index) => (
        <MenuItem
          key={index}
          index={index}
          title={title}
          isActive={index === activeIndex}
          onClick={() => handleItemClick(index, colors[index])}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </div>
  );
};

export default MainMenu;
