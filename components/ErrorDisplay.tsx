
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-500/30 border border-red-700 text-red-100 px-4 py-3 rounded-lg relative text-center" role="alert">
      <strong className="font-bold block sm:inline">Error:</strong>
      <span className="block sm:inline ml-1">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 ml-auto mr-auto block bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
    