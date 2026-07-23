import React from 'react';
import { Box, Typography } from '@mui/material';

const EmptyIllustration = () => (
  <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="48" cy="80" rx="30" ry="6" fill="#EFE9F2" />
    <path
      d="M24 66 L24 38 C24 34 27 31 31 31 L65 31 C69 31 72 34 72 38 L72 66 Z"
      fill="#FFFFFF"
      stroke="#DDD3E0"
      strokeWidth="2"
    />
    <path d="M24 52 L38 52 L42 58 L54 58 L58 52 L72 52" stroke="#DDD3E0" strokeWidth="2" fill="none" />
    <circle cx="48" cy="20" r="9" fill="#F9EFEA" stroke="#E85D4E" strokeWidth="2" />
  </svg>
);

const EmptyState = ({ title = 'Sin resultados', subtitle }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5, gap: 1 }}>
    <EmptyIllustration />
    <Typography variant="subtitle2" color="text.primary" sx={{ mt: 1 }}>
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ maxWidth: 320 }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

export default EmptyState;
