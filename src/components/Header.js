import React, { useEffect } from 'react';
import '../App.css';

const Header = ({ isMenuActive }) => {
  useEffect(() => {
    const text = document.getElementById('scrolling-text');
    let position = 0;
    const speed = 0.5;

    const animateText = () => {
      position -= speed;
      text.style.transform = `translateX(${position}px)`;
      if (Math.abs(position) >= text.offsetWidth / 2) {
        position = 0;
      }

      requestAnimationFrame(animateText);
    };

    animateText();
  }, []);

  return (
    <div className={`header-container ${isMenuActive ? 'menu-active' : ''}`}>
      <div className="scrolling-text" id="scrolling-text">
        {'MIO PROEPPER '.repeat(10).split(' ').map((word, index) => (
          <span key={index} className={`word ${isMenuActive ? 'active-outline' : word === 'MIO' ? 'stay-hollow' : 'visible'}`}>
            {word}&nbsp;
          </span>
        ))}
      </div>
    </div>
  );
};

export default Header;

