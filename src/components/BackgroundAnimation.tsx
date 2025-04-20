import React from 'react';

const BackgroundAnimation = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden flex items-center justify-center w-full h-full pointer-events-none">
      <div className="gradient"></div>
    </div>
  );
};

export default BackgroundAnimation;
