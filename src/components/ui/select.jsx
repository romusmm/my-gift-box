import React, { createContext, useContext, useState } from 'react';

const Ctx = createContext(null);

export function Select({ value, onValueChange, children }) {
  const [open, setOpen] = useState(false);
  return <Ctx.Provider value={{ value, setValue: onValueChange, open, setOpen }}>{children}</Ctx.Provider>;
}

export function SelectTrigger({ className = '', children, ...props }) {
  const ctx = useContext(Ctx);
  return (
    <button
      {...props}
      type="button"
      onClick={() => ctx.setOpen(!ctx.open)}
      className={'mt-2 w-full rounded-xl border px-3 py-2 text-left ' + className}
    >
      {children}
    </button>
  );
}

export function SelectValue({ placeholder }) {
  const ctx = useContext(Ctx);
  return <span className="text-sm">{ctx.value || placeholder}</span>;
}

export function SelectContent({ className = '', children }) {
  const ctx = useContext(Ctx);
  if (!ctx.open) return null;
  return (
    <div className={'relative'}>
      <div className={'absolute z-50 mt-2 w-full rounded-xl border bg-white shadow ' + className}>{children}</div>
    </div>
  );
}

export function SelectItem({ value, children }) {
  const ctx = useContext(Ctx);
  return (
    <button
      type="button"
      className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-100"
      onClick={() => {
        ctx.setValue(value);
        ctx.setOpen(false);
      }}
    >
      {children}
    </button>
  );
}
