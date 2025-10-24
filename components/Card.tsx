// src/components/Card.tsx

import React, { forwardRef } from 'react';

// Definimos los props, incluyendo `children` y `className`
interface CardProps {
  children: React.ReactNode;
  className?: string;
  id?: string; // Permitimos que el componente reciba un 'id'
}

// Usamos forwardRef para pasar la ref al div
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

// Añadimos un displayName para facilitar la depuración en las herramientas de React
Card.displayName = 'Card';
