import React from 'react';

export function Card({ className = '', ...props }) {
  return <div {...props} className={'border bg-white rounded-3xl ' + className} />;
}
export function CardHeader({ className = '', ...props }) {
  return <div {...props} className={'p-5 ' + className} />;
}
export function CardContent({ className = '', ...props }) {
  return <div {...props} className={'px-5 pb-5 ' + className} />;
}
export function CardFooter({ className = '', ...props }) {
  return <div {...props} className={'px-5 pb-5 ' + className} />;
}
export function CardTitle({ className = '', ...props }) {
  return <h3 {...props} className={'text-lg font-semibold ' + className} />;
}
export function CardDescription({ className = '', ...props }) {
  return <p {...props} className={'text-sm text-neutral-500 ' + className} />;
}
