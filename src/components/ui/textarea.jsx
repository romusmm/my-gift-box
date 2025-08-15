import React from 'react';

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      {...props}
      className={
        'w-full rounded-xl border px-3 py-2 text-sm outline-none min-h-[100px] ' +
        'focus:ring-2 focus:ring-indigo-200 ' + className
      }
    />
  );
}
