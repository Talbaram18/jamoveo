import React from 'react';
import { InputProps } from '../interfaces';
/**
 *Input component
 *Supports text inputs, password inputs, and select dropdowns
 */
export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  options,
  className = '',
  required = false,
}) => {
  const renderInput = () => {
    // render the appropriate input type based on props

    if (type === 'select') {
      return (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`form-input ${className}`}
          required={required}
        >
          <option value="">Select {label}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-input ${className}`}
        required={required}
      />
    );
  };

  return (
    <div className="form-group">
      {/* Show label if provided */}
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
        </label>
      )}
      {/* Render the appropriate input element */}

      {renderInput()}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};
