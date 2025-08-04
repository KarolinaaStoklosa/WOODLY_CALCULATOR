import React from 'react';

const Card = ({ 
  children, 
  title, 
  className = '',
  padding = 'md',
  shadow = 'md'
}) => {
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const shadowStyles = {
    sm: 'shadow-sm',
    md: 'shadow-lg',
    lg: 'shadow-xl'
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 ${shadowStyles[shadow]} ${paddingStyles[padding]} ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;