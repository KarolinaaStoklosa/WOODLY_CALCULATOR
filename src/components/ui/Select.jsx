import React from 'react';

const Select = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Wybierz opcję',
  required = false,
  error,
  className = '',
  ...props 
}) => {
  const selectStyles = `
    w-full px-3 py-2 border rounded-lg text-gray-700 bg-white
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    transition-all duration-200 cursor-pointer
    ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}
  `;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={selectStyles}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value || option.nazwa || option}>
            {option.label || option.nazwa || option}
            {option.cena && ` - ${option.cena}`}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default Select;