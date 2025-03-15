import React from 'react';
import { ButtonProps } from '../interfaces';
/**
 * Button component with multiple style variants
 **/
export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
}) => {
  const variantClasses = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    outline: 'btn btn-outline',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${variantClasses[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
