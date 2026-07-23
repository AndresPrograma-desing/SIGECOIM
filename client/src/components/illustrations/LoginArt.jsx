import React from 'react';

// Composición ilustrativa propia para el panel del Login: formas orgánicas
// + un pentagrama que ondula, en vez de una foto de stock con glassmorphism.
const LoginArt = () => (
  <svg
    viewBox="0 0 480 640"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', height: '100%' }}
  >
    <defs>
      <linearGradient id="loginBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3A2748" />
        <stop offset="100%" stopColor="#1C1224" />
      </linearGradient>
      <linearGradient id="blobA" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E85D4E" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#C23F2E" stopOpacity="0.9" />
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#F3846F" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#F3846F" stopOpacity="0" />
      </radialGradient>
    </defs>

    <rect width="480" height="640" fill="url(#loginBg)" />
    <rect width="480" height="640" fill="url(#glow)" />

    {/* Formas orgánicas de fondo */}
    <path
      d="M-40 120 C 40 40, 180 10, 260 70 C 340 130, 300 230, 210 250 C 110 272, -110 220, -40 120 Z"
      fill="#4A3359"
      opacity="0.55"
    />
    <path
      d="M420 520 C 500 460, 520 360, 440 320 C 360 280, 260 330, 250 420 C 240 510, 340 580, 420 520 Z"
      fill="url(#blobA)"
      opacity="0.85"
    />
    <circle cx="80" cy="480" r="70" fill="#4A3359" opacity="0.4" />

    {/* Pentagrama ondulado */}
    <g stroke="rgba(255,255,255,0.28)" strokeWidth="1.6" fill="none">
      <path d="M-20 330 C 100 300, 200 360, 320 320 C 400 296, 460 330, 500 310" />
      <path d="M-20 350 C 100 320, 200 380, 320 340 C 400 316, 460 350, 500 330" />
      <path d="M-20 370 C 100 340, 200 400, 320 360 C 400 336, 460 370, 500 350" />
      <path d="M-20 390 C 100 360, 200 420, 320 380 C 400 356, 460 390, 500 370" />
      <path d="M-20 410 C 100 380, 200 440, 320 400 C 400 376, 460 410, 500 390" />
    </g>

    {/* Notas flotantes */}
    <circle cx="130" cy="352" r="5" fill="#F3846F" />
    <circle cx="250" cy="386" r="5" fill="#ffffff" fillOpacity="0.85" />
    <circle cx="360" cy="330" r="5" fill="#F3846F" />
    <circle cx="80" cy="180" r="4" fill="#ffffff" fillOpacity="0.5" />
    <circle cx="300" cy="150" r="3.5" fill="#ffffff" fillOpacity="0.4" />
  </svg>
);

export default LoginArt;
