import React, { useState, useEffect } from 'react';
import '../assets/styles/Card.css';

export interface CardProps {
  imageSrc: string;
  altText: string;
  title: string;
  dateRange: string;
  hoverText: string;
  open?: boolean;
}

const Card: React.FC<CardProps> = ({ imageSrc, altText, title, dateRange, hoverText, open = false }) => {
  const [isClicked, setIsClicked] = useState(open);
  const [isMobile, setIsMobile] = useState(false);

  // Detecta se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // No mobile, sempre começa fechado independente da prop 'open'
  useEffect(() => {
    if (isMobile) {
      setIsClicked(false);
    } else {
      setIsClicked(open);
    }
  }, [isMobile, open]);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  return (
    <div className={`card-wrapper ${isClicked ? "expanded" : ""}`} onClick={handleClick}>
      <div className="card-container">
        <div className="card-image-wrapper">
          <img src={imageSrc} alt={altText} className="card-image" />
        </div>
        <div className="card-info">
          <h3>{title}</h3>
          <p>{dateRange}</p>
        </div>
      </div>

      <div className="card-click-text">
        {hoverText.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
};

export default Card;