import React from 'react';
import { Avatar } from '@mui/material';

const UserAvatar = ({ nombre }) => {
  const initials = nombre
    ? nombre.substring(0, 2).toUpperCase()
    : 'US';

  return (
    <Avatar
      sx={{
        bgcolor: 'secondary.main',
        color: '#ffffff',
        width: 38,
        height: 38,
        fontSize: '0.9rem',
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      {initials}
    </Avatar>
  );
};

export default UserAvatar;
