import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'success' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  isLoading, 
  icon,
  iconPosition = 'left',
  className, 
  disabled,
  ...props 
}) => {
  // Classes de base
  const base = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg";
  
  // Variantes de couleur
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-md shadow-blue-200/50 active:scale-[0.98]",
    secondary: "bg-gradient-to-r from-slate-600 to-slate-500 text-white hover:from-slate-700 hover:to-slate-600 shadow-md shadow-slate-200/50 active:scale-[0.98]",
    success: "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 shadow-md shadow-emerald-200/50 active:scale-[0.98]",
    danger: "bg-gradient-to-r from-rose-600 to-rose-500 text-white hover:from-rose-700 hover:to-rose-600 shadow-md shadow-rose-200/50 active:scale-[0.98]",
    outline: "border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 active:scale-[0.98]",
    ghost: "text-slate-700 hover:bg-slate-100 active:scale-[0.98]"
  };

  // Tailles simplifiées
  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-2",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5"
  };

  return (
    <button 
      className={`
        ${base} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${className || ''}
      `} 
      disabled={isLoading || disabled} 
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <span className="whitespace-nowrap">{children}</span>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </button>
  );
};