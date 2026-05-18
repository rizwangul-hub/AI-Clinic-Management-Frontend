import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Calendar,
  FileText,
  Activity,
  LogOut,
  Menu,
  X,
  Shield,
  Stethoscope,
  FileSpreadsheet,
  Settings,
  Heart,
  TrendingUp,
  Bell,
  Cpu,
  Globe
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const role = user?.role || 'Patient';

  // Navigation configurations based on Role
  const navItems = {
    Admin: [
      { path: '/admin', label: 'Dashboard Overview', icon: Shield },
      { path: '/admin/doctors', label: 'Manage Doctors', icon: Stethoscope },
      { path: '/admin/receptionists', label: 'Receptionists Registry', icon: Users },
      { path: '/admin/subscription', label: 'Service Subscription', icon: Settings },
    ],
    Doctor: [
      { path: '/doctor', label: 'EHR Workspace', icon: Stethoscope },
      { path: '/doctor/appointments', label: 'Diagnostic Pipeline', icon: Calendar },
      { path: '/doctor/history', label: 'Patient Medical Charts', icon: FileSpreadsheet },
    ],
    Receptionist: [
      { path: '/receptionist', label: 'Operations Deck', icon: FileSpreadsheet },
      { path: '/receptionist/patients', label: 'Register New Patient', icon: Users },
      { path: '/receptionist/book', label: 'Schedule Consultation', icon: Calendar },
    ],
    Patient: [
      { path: '/patient', label: 'Wellness Portal', icon: Heart },
      { path: '/patient/appointments', label: 'My Consultations', icon: Calendar },
      { path: '/patient/prescriptions', label: 'My Prescriptions', icon: FileText },
      { path: '/patient/history', label: 'Clinical Timeline', icon: Activity },
    ],
  };

  const currentNavItems = navItems[role] || navItems.Patient;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeColor = (r) => {
    switch (r) {
      case 'Admin': return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
      case 'Doctor': return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400';
      case 'Receptionist': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      default: return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400';
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-950/75 border border-white/[0.04] text-slate-350 rounded-3xl overflow-hidden shadow-2xl relative">
      {/* Decorative ambient background blur inside sidebar */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500/5 blur-2xl rounded-full pointer-events-none" />

      {/* Brand logo frame */}
      <div className="p-6 border-b border-white/[0.04] flex items-center space-x-3.5 relative z-10">
        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-extrabold shadow-lg shadow-indigo-500/25 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Heart size={18} className="animate-pulse text-white relative z-10" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-white tracking-tight leading-none">ClinicOS</h2>
          <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-widest mt-1 block">AI Clinical OS</span>
        </div>
      </div>

      {/* Nav items list */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 relative z-10 overflow-y-auto">
        {currentNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? 'text-white border border-white/[0.05] shadow-[0_0_15px_rgba(99,102,241,0.06)]'
                  : 'hover:bg-white/[0.03] hover:text-slate-100 text-slate-400 border border-transparent'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActivePill"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-550/15 via-purple-550/10 to-cyan-550/15 rounded-2xl -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {isActive && (
                <span className="absolute left-0 top-1/3 bottom-1/3 w-[3px] bg-gradient-to-b from-indigo-400 to-cyan-400 rounded-full" />
              )}
              <Icon size={16} className={`transition-colors duration-300 ${isActive ? 'text-indigo-400' : 'text-slate-550 group-hover:text-slate-350'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User profile footer */}
      <div className="p-5 border-t border-white/[0.04] bg-slate-950/45 space-y-4 relative z-10">
        <div className="flex items-center space-x-3 px-1">
          <div className="w-10 h-10 bg-slate-900 border border-white/[0.06] rounded-2xl flex items-center justify-center text-white font-extrabold shadow-inner font-mono text-sm uppercase">
            {user?.name?.slice(0, 2) || 'US'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-extrabold text-white truncate leading-none mb-1.5">
              {user?.name || 'Loading Name'}
            </p>
            <span className={`px-2.5 py-0.5 border text-[9px] font-extrabold uppercase rounded-full tracking-wider ${getRoleBadgeColor(role)}`}>
              {role}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 hover:text-rose-350 transition-all duration-300 border border-rose-500/10 hover:border-rose-500/20"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] flex font-sans antialiased text-slate-300 relative overflow-hidden">
      {/* Dynamic ambient cyber glow overlays on viewport edges */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Desktop Floating Sidebar Wrapper */}
      <aside className="hidden lg:block w-72 flex-shrink-0 h-screen sticky top-0 p-5 z-45">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen p-5 pl-0 lg:pl-0">
        {/* Top Navbar */}
        <header className="h-20 bg-slate-950/45 border border-white/[0.04] rounded-3xl mb-5 flex items-center justify-between px-6 backdrop-blur-xl relative z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05]"
            >
              <Menu size={18} />
            </button>
            
            {/* System Status Indicators */}
            <div className="hidden md:flex items-center space-x-3.5">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-widest font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-cyber-pulse" />
                SYSTEM_LIVE
              </div>
              <div className="text-[10px] text-slate-550 font-mono flex items-center gap-1.5">
                <Cpu size={12} />
                AI Latency: 14ms
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Simulated Plan Tag */}
            {user?.subscriptionPlan && (
              <span className="px-3.5 py-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/25 text-amber-400 font-mono text-[9px] font-bold uppercase rounded-full shadow-sm tracking-widest">
                🏆 {user.subscriptionPlan} Member
              </span>
            )}
            
            <div className="h-5 w-[1px] bg-white/[0.05]" />
            
            {/* Ambient telemetry indicators */}
            <div className="text-right hidden sm:block font-mono">
              <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest flex items-center justify-end gap-1">
                <Globe size={10} className="text-slate-550" />
                Primary Core
              </p>
              <p className="text-[10px] font-bold text-slate-400">US-EAST-01</p>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileOpen(false)}
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="fixed inset-y-0 left-0 w-80 p-5 z-10"
              >
                <div className="absolute right-9 top-9 z-20">
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="p-2 rounded-xl text-slate-450 hover:text-white bg-slate-900 border border-white/[0.04]"
                  >
                    <X size={16} />
                  </button>
                </div>
                <SidebarContent />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto max-w-[1600px] w-full mx-auto pb-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
