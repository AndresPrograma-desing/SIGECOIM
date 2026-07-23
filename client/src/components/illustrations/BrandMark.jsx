import React from 'react';

// Monograma "S" trazado a mano en dos capas (ciruela + coral) con motivo de clave de sol estilizado.
const BrandMark = ({ size = 32, mono = false }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13 28.5c0 4 3.2 6.5 8 6.5s8.5-2.6 8.5-7c0-4-3-6-8-7.3-5-1.3-7-3-7-6 0-3.4 2.8-5.7 6.5-5.7 3.3 0 5.8 1.5 6.8 4.2"
      stroke={mono ? 'currentColor' : '#F3846F'}
      strokeWidth="3.4"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="13.2" cy="30.4" r="2.6" fill={mono ? 'currentColor' : '#E85D4E'} />
  </svg>
);

export default BrandMark;
