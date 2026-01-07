import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-sm font-semibold text-slate-700">{label}</label>
    <input
      {...props}
      className={`p-2 border rounded-lg outline-none transition-all focus:ring-2 
      ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200 focus:border-blue-500'}`}
    />
    {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
  </div>
);