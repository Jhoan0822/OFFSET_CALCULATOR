// src/components/Card.tsx

import React, { forwardRef } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', id }, ref) => {
    return (
      <div 
        ref={ref} 
        id={id} 
        className={`bg-white rounded-lg shadow-md p-6 ${className}`}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
