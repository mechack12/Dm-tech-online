import React, { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Button({ 
  children, 
  className, 
  variant = 'primary', 
  ...props 
}: { 
  children: ReactNode; 
  className?: string; 
  variant?: 'primary' | 'outline' | 'ghost' | 'icon';
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants = {
    primary: 'bg-brand-primary text-bg-dark hover:opacity-90',
    outline: 'border border-white/20 text-white hover:bg-white/5',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
    icon: 'p-2 text-gray-400 hover:text-white bg-white/5 rounded-full hover:bg-white/10'
  };

  return (
    <button 
      className={cn(
        'px-4 py-2 font-medium rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variant !== 'icon' ? variants[variant] : variants.icon,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({ 
  children, 
  variant = 'default' 
}: { 
  children: ReactNode; 
  variant?: 'default' | 'success' | 'warning' | 'danger';
}) {
  const variants = {
    default: 'bg-white/10 text-gray-400',
    success: 'bg-green-500/10 text-green-500 border border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
    danger: 'bg-red-500/10 text-red-500 border border-red-500/20'
  };

  return (
    <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider', variants[variant])}>
      {children}
    </span>
  );
}

export function Card({ children, className, hover = false, ...props }: { children: ReactNode; className?: string; hover?: boolean; [key: string]: any }) {
  return (
    <div className={cn(
      'bg-surface-dark border border-border-dark rounded-xl overflow-hidden',
      hover && 'hover:border-brand-primary/50 transition-colors',
      className
    )} {...props}>
      {children}
    </div>
  );
}
