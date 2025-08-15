import React from 'react';

export function Input({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={
        'w-full rounded-xl border px-3 py-2 text-sm outline-none ' +
        'focus:ring-2 focus:ring-indigo-200 ' + className
      }
    />
  );
}
