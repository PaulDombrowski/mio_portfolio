import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import MenuItem from './MenuItem';

const MainMenu = ({ onMenuToggle, onColorChange, setActiveColor, setHoverColor }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [startX, setStartX] = useState(null);
  const appRef = useRef(null);

  useEffect(() => {
    appRef.current = document.querySelector('.App');
  }, []);

  const handleItemClick = (index, color) => {
    const newIndex = index === activeIndex ? null : index;
    setActiveIndex(newIndex);
    setHoveredIndex(null); // Clear hovered index
    onMenuToggle(newIndex !== null);
    onColorChange(newIndex !== null ? color : null);
    setActiveColor(newIndex !== null ? color : null);
    setHoverColor(null);  // Clear hover color
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
    setActiveIndex(newIndex);
    setHoveredIndex(null); // Clear hovered index
    onMenuToggle(newIndex !== null);
    onColorChange(newIndex !== null ? colors[newIndex] : null);
    setActiveColor(newIndex !== null ? colors[newIndex] : null);
    setHoverColor(null); // Clear hover color when changing active menu
  };

  const handleMouseEnter = (index) => {
    if (index !== activeIndex) {
      setHoveredIndex(index); // Set hovered index
      setHoverColor(colors[index]);
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null); // Clear hovered index
    setHoverColor(null);
  };

  const menuItems = [
    'MIO PROEPPER',
    'DISKRIMINIERUNGSKRITISCHES LEKTORAT',
    'POLITISCHE BILDUNG & BERATUNG',
    'CONTACT',
    'IMPRESSUM'
  ];

  const colors = [
    "rgba(57, 255, 20, 1)",
    "rgba(0, 255, 255, 1)",
    "rgba(255, 7, 58, 1)",
    "rgba(255, 0, 255, 1)",
    "rgba(255, 255, 0, 1)"
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
          isHovered={index === hoveredIndex && index !== activeIndex}
          onClick={() => handleItemClick(index, colors[index])}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </div>
  );
};

export default MainMenu;
