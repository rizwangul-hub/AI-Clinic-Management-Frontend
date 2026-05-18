import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, UserCheck, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import { registerSchema } from '../schemas/authSchemas';
import { useAuth } from '../context/AuthContext/AuthContext';
import { Input } from '../components/Input';

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser, googleLogin } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'Patient',
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong during sign up.');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const data = await googleLogin(tokenResponse.access_token);
        toast.success('Successfully logged in with Google!');

        // Dynamic Role-based Redirect
        const role = data.data?.role || 'Patient';
        if (role === 'Admin') navigate('/admin');
        else if (role === 'Doctor') navigate('/doctor');
        else if (role === 'Receptionist') navigate('/receptionist');
        else navigate('/patient');
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

      {/* Left Canvas Panel: Alternate Aesthetic for Variant Feel */}
      <div className="hidden md:flex md:w-1/2 relative bg-slate-900 justify-center items-center p-12 overflow-hidden border-r border-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#1e1b4b,transparent_60%)] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,#311042,transparent_60%)] opacity-50" />

        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-80 h-80 bg-purple-600/10 blur-[90px] rounded-full bottom-10 right-10"
        />

        <div className="relative z-10 max-w-md text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold rounded-full tracking-wide uppercase">
              Join the ecosystem
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mt-6 mb-4 leading-tight">


              Digitize Clinic. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400">
                Scale limitlessly.
              </span>
            </h1>                <p className="text-xs text-slate-500 font-mono">SYSTEM_STATUS_OK</p>
            <p className="text-sm font-semibold text-white">All clinical databases online</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ rotateX: -10, rotateY: 15, transformStyle: 'preserve-3d' }}
            transition={{ duration: 1, delay: 0.2, type: 'spring' }}
            className="mt-12 p-6 bg-white/[0.01] border border-white/[0.05] backdrop-blur-xl rounded-2xl shadow-2xl relative group"
          >
            <div className="flex items-between justify-between">
              <span className="text-xs font-mono text-slate-500">API_LATENCY</span>
              <span className="text-xs font-mono text-emerald-400 font-bold">14ms</span>
            </div>
            <div className="w-full bg-slate-800/40 h-1.5 rounded-full mt-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '88%' }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-20 bg-slate-950">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight">Create an account</h2>
            <p className="text-slate-400 text-sm mt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Sign in
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
              <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.96 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8C6.01 7.05 8.74 5.04 12 5.04z" />
              <path fill="#4285F4" d="M23.5 12.25c0-.82-.07-1.6-.2-2.35H12v4.46h6.46c-.28 1.47-1.11 2.71-2.36 3.56l3.6 2.8c2.1-1.94 3.3-4.8 3.3-8.47z" />
              <path fill="#FBBC05" d="M5.1 14.7c-.23-.69-.35-1.43-.35-2.2s.12-1.51.35-2.2L1.5 7.5C.54 9.4 0 11.64 0 14s.54 4.6 1.5 6.5l3.6-2.8z" />
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.6-2.8c-1.1.74-2.52 1.18-4.36 1.18-3.26 0-5.99-2.01-6.98-4.96l-3.6 2.8C3.4 20.35 7.35 23 12 23z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <span className="relative bg-slate-950 px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Or registration keys
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <Input
              label="Name"
              type="text"
              icon={User}
              placeholder="John Doe"
              error={errors.name}
              {...register('name')}
            />
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="name@company.com"
              error={errors.email}
              {...register('email')}
            />

            {/* Account Role Dropdown */}
            <div className="w-full mb-5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Select Account Role
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors duration-250">
                  <UserCheck size={18} />
                </div>
                <select
                  className="w-full bg-slate-900/50 text-white rounded-xl py-3.5 pl-11 pr-10 border border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20 outline-none ring-4 ring-transparent transition-all duration-300 font-medium appearance-none select-role cursor-pointer"
                  {...register('role')}
                >
                  <option value="Patient" className="bg-slate-950 text-white">Patient</option>
                  <option value="Doctor" className="bg-slate-950 text-white">Doctor</option>
                  <option value="Receptionist" className="bg-slate-950 text-white">Receptionist</option>
                  <option value="Admin" className="bg-slate-950 text-white">Admin</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                  <ChevronDown size={18} />
                </div>
              </div>
              {errors.role && (
                <p className="text-xs font-medium text-rose-450 mt-1.5 ml-1">{errors.role.message}</p>
              )}
            </div>

            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              error={errors.password}
              {...register('password')}
            />

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-purple-500/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}