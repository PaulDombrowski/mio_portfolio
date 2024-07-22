import React from 'react';
import '../App.css';

const MenuItem = ({ index, title, content, isActive, onClick, onMouseEnter, onMouseLeave }) => {
  return (
    <div
      className={`menu-item ${isActive ? 'active' : ''}`}
      onClick={() => onClick(index)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="menu-title">{title}</div>
      {isActive && <div className="menu-content">{content}</div>}
    </div>
  );
};

export default MenuItem;
