import React from 'react';
import '../assets/styles/TechnologyCard.css';

type TechnologyCardProps = {
  name: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
  index?: number; // índice para delay da animação
};

const TechnologyCard: React.FC<TechnologyCardProps> = ({ name, Icon, color, index = 0 }) => {
  return (
    <div
      className="technology-card"
      style={{ animationDelay: `${index * 0.2}s` }} // cada card entra depois do anterior
    >
      <Icon size={60} color={color} />
      <p className="technology-name">{name}</p>
    </div>
  );
};

export default TechnologyCard;
