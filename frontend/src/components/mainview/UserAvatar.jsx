import React from 'react';
import { User } from 'lucide-react';

const UserAvatar = ({
  userName,
  size = 24,
  backgroundColor = '#4ade80',
  iconColor = '#000000',
  className = ''
}) => {
  const avatarStyle = {
    width: size,
    height: size,
    backgroundColor: backgroundColor,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  };

  return (
    <div
      className={`user-avatar ${className}`}
      style={avatarStyle}
      title={userName || 'Usuário'}
    >
      <User
        size={size * 0.6}
        color={iconColor}
        strokeWidth={2}
      />
    </div>
  );
};

export default UserAvatar;

