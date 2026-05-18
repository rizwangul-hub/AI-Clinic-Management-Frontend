import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className = '',
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`p-6 glass-panel glass-panel-hover rounded-2xl relative overflow-hidden group shadow-xl ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Decorative Cybernetic Background Grid Highlight */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity duration-300" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 blur-2xl rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-3.5">
          <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text bg-gradient-to-br from-white via-slate-100 to-slate-400">
            {value}
          </h3>
          {description && (
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              {description}
            </p>
          )}
        </div>

        {Icon && (
          <div className="p-3.5 bg-slate-950/60 rounded-2xl text-indigo-400 border border-white/[0.03] group-hover:text-white group-hover:bg-gradient-to-br group-hover:from-indigo-650 group-hover:to-cyan-650 group-hover:border-indigo-400/20 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] transition-all duration-300">
            <Icon size={18} />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-5 flex items-center space-x-2 text-xs relative z-10 font-mono">
          <span className={`px-2 py-0.5 rounded-lg font-bold border ${
            trend.isPositive 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-450' 
              : 'bg-rose-500/10 border-rose-500/20 text-rose-455'
          }`}>
            {trend.value}
          </span>
          <span className="text-slate-500 font-medium">
            {trend.label}
          </span>
        </div>
      )}
    </motion.div>
  );
};
