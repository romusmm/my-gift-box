import React from 'react';

export function Badge({ className = '', variant = 'default', ...props }) {
  const base =
    variant === 'outline'
      ? 'border rounded-full px-2 py-0.5 text-xs'
      : 'bg-neutral-900 text-white rounded-full px-2 py-0.5 text-xs';
  return <span {...props} className={base + ' ' + className} />;
}
