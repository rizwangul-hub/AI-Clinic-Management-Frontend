import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

export const Input = React.forwardRef(({ 
  label, 
  type = 'text', 
  error, 
  icon: Icon, 
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="w-full mb-5">
      {label && (
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">
          {label}
        </label>
      )}
      
      {/* Shake animation variant on validation errors */}
      <motion.div 
        animate={error ? { x: [-6, 6, -4, 4, 0] } : {}}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="relative group"
      >
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none transition-colors duration-300 group-focus-within:text-cyan-400">
            <Icon size={16} />
          </div>
        )}

        <input
          ref={ref}
          type={inputType}
          className={`w-full bg-slate-950/45 text-white rounded-xl py-3.5 ${Icon ? 'pl-11' : 'px-4'} ${isPassword ? 'pr-12' : 'pr-4'} border ${
            error 
              ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/10' 
              : 'border-white/[0.04] focus:border-indigo-500/60 focus:ring-indigo-500/10'
          } outline-none ring-4 ring-transparent transition-all duration-300 placeholder:text-slate-600 font-semibold text-sm backdrop-blur-md shadow-inner`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors duration-250"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs font-semibold text-rose-400 mt-1.5 ml-1 font-mono"
          >
            ● {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';