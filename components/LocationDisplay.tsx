
import React from 'react';
import { Coordinates } from '../types';

interface LocationDisplayProps {
  coordinates: Coordinates;
  city?: string;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({ coordinates, city }) => {
  return (
    <div className="text-center mb-6 p-4 bg-white/10 rounded-lg shadow-md">
      {city && <h2 className="text-2xl md:text-3xl font-semibold text-sky-100 mb-1">{city}</h2>}
      <p className="text-sm text-sky-200">
        Latitude: {coordinates.latitude.toFixed(4)}, Longitude: {coordinates.longitude.toFixed(4)}
      </p>
    </div>
  );
};
