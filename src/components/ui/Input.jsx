import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false,
  error,
  className = '',
  ...props 
}) => {
const inputStyles = `
  w-full px-3 py-2 border rounded-lg text-gray-700 bg-white
  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
  transition-all duration-200
  dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600
  ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'}
`;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputStyles}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;