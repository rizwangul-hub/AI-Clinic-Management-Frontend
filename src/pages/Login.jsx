import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import { loginSchema } from '../schemas/authSchemas';
import { useAuth } from '../context/AuthContext/AuthContext';
import { Input } from '../components/Input';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const redirectByRole = (role) => {
    // role value returned is case insensitive matching our authorizeRoles
    const normalizedRole = role?.toLowerCase();
    if (normalizedRole === 'admin') {
      navigate('/admin');
    } else if (normalizedRole === 'doctor') {
      navigate('/doctor');
    } else if (normalizedRole === 'receptionist') {
      navigate('/receptionist');
    } else {
      navigate('/patient');
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await login(data);
      toast.success('Welcome back! Authentication successful.');
      
      const role = response.data?.role || 'Patient';
      redirectByRole(role);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const response = await googleLogin(tokenResponse.access_token);
        toast.success('Successfully logged in with Google!');
        
        const role = response.data?.role || 'Patient';
        redirectByRole(role);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Google login failed.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast.error('Google login was unsuccessful.');
    }
  });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* Left Canvas Panel: Ambient Cinematic Art */}
      <div className="hidden md:flex md:w-1/2 relative bg-slate-900 justify-center items-center p-12 overflow-hidden border-r border-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#312e81,transparent_50%)] opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,#4c1d95,transparent_50%)] opacity-40" />
        
        {/* Animated Background Mesh Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute w-96 h-96 bg-indigo-600/10 blur-[80px] rounded-full top-10 left-10"
        />
        
        <div className="relative z-10 max-w-md text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full tracking-wide uppercase">
              ClinicSaaS AI Clinical OS
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mt-6 mb-4 leading-tight">
              Digitize Clinic <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                Operations & AI.
              </span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Experience the future of medical practice operations with our unified workflow ecosystem.
            </p>
          </motion.div>

          {/* Interactive Floating Glassmorphism Metric Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ rotateX: 15, rotateY: -15, transformStyle: 'preserve-3d' }}
            transition={{ duration: 1, delay: 0.2, type: 'spring' }}
            className="mt-12 p-6 bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl rounded-2xl shadow-2xl relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-mono">SYSTEM_STATUS_OK</p>
                <p className="text-sm font-semibold text-white">All clinical databases online</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-20 bg-slate-950">
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight">Welcome back</h2>
            <p className="text-slate-400 text-sm mt-2">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Sign up instead
              </Link>
            </p>
          </div>

          {/* OAuth Container */}
          <button
            onClick={loginWithGoogle}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-850 text-white font-medium py-3.5 px-4 rounded-xl border border-slate-800 transition-all duration-200 active:scale-[0.99] group mb-6"
          >
            <svg className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.96 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8C6.01 7.05 8.74 5.04 12 5.04z"/>
              <path fill="#4285F4" d="M23.5 12.25c0-.82-.07-1.6-.2-2.35H12v4.46h6.46c-.28 1.47-1.11 2.71-2.36 3.56l3.6 2.8c2.1-1.94 3.3-4.8 3.3-8.47z"/>
              <path fill="#FBBC05" d="M5.1 14.7c-.23-.69-.35-1.43-.35-2.2s.12-1.51.35-2.2L1.5 7.5C.54 9.4 0 11.64 0 14s.54 4.6 1.5 6.5l3.6-2.8z"/>
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.6-2.8c-1.1.74-2.52 1.18-4.36 1.18-3.26 0-5.99-2.01-6.98-4.96l-3.6 2.8C3.4 20.35 7.35 23 12 23z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <span className="relative bg-slate-950 px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Or secure mail
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="name@company.com"
              error={errors.email}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              error={errors.password}
              {...register('password')}
            />

            <div className="flex justify-end pt-1 pb-4">
              <a href="#forgot" className="text-xs text-slate-400 hover:text-white transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-650 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}