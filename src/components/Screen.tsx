import React from 'react';

interface ScreenProps {
  children: React.ReactNode;
}

const Screen: React.FC<ScreenProps> = ({ children }) => {
  return (
    <div className="pipboy-screen">
      <div className="static-overlay"></div>
      <div className="pipboy-vignette"></div>
      {children}
    </div>
  );
};

export default Screen;

