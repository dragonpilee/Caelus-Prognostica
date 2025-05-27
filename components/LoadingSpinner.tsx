
import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-200 mb-4"></div>
      <p className="text-lg font-medium text-sky-100">{text}</p>
    </div>
  );
};
    