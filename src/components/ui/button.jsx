import React from 'react';

export function Button({ className = '', ...props }) {
  return (
    <button
      {...props}
      className={
        // solo estilos estructurales, nada de color por defecto
        'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium shadow-sm ' +
        'transition cursor-pointer disabled:opacity-50 disabled:pointer-events-none ' +
        className
      }
    />
  );
}
