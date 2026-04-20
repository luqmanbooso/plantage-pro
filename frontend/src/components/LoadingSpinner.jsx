import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizes = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`animate-spin rounded-full border-b-2 border-plant-medium ${sizes[size]}`}></div>
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
