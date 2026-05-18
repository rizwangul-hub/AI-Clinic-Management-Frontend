import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:via-purple-500 hover:to-cyan-500 text-white border border-indigo-400/20 shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.35)] focus:ring-indigo-500',
    secondary: 'bg-slate-900/80 hover:bg-slate-850/90 text-slate-200 border border-slate-800/80 focus:ring-slate-700',
    danger: 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white border border-rose-400/20 shadow-[0_0_20px_rgba(244,63,94,0.15)] hover:shadow-[0_0_25px_rgba(244,63,94,0.3)] focus:ring-rose-500',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border border-emerald-400/20 shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] focus:ring-emerald-500',
    outline: 'border border-slate-800 bg-slate-950/20 text-slate-350 hover:bg-slate-900/60 hover:text-white hover:border-slate-700 focus:ring-slate-800',
    glass: 'bg-white/[0.02] border border-white/[0.05] backdrop-blur-md text-slate-200 hover:bg-white/[0.06] hover:border-white/[0.1] focus:ring-slate-600 shadow-md',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  return (
    <motion.button
      whileTap={(!disabled && !isLoading) ? { scale: 0.96 } : {}}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />
      ) : Icon ? (
        <Icon className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-105" />
      ) : null}
      {children}
    </motion.button>
  );
};
