import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '../components/Card';
import { Table } from '../components/Table';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { clinicService } from '../services/api/clinicService';
import { Stethoscope, Users, Calendar, TrendingUp, Sparkles, Plus, Award, Shield, Cpu, RefreshCw, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [receptionists, setReceptionists] = useState([]);
  
  // Subscription Plan Simulation State
  const [plans, setPlans] = useState([
    { id: 1, name: 'Free Starter', price: '$0/mo', features: 'Basic Patient Records, 10 Appointments/mo, No AI Support' },
    { id: 2, name: 'Professional Tier', price: '$49/mo', features: 'Full Records, Unlimited Appointments, Basic Clinical Insights' },
    { id: 3, name: 'Enterprise AI Suite', price: '$99/mo', features: 'Advanced Predictive Diagnosis AI, Unlimited PDF Prescriptions, Premium Dedicated Support' }
  ]);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planForm, setPlanForm] = useState({ name: '', price: '', features: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const dashboardData = await clinicService.getAdminDashboard();
      setStats(dashboardData);

      const docData = await clinicService.getAdminDoctors();
      setDoctors(docData.doctors || []);

      // Mock receptionists for UI, as backend mainly serves dashboard stats and doctors
      setReceptionists([
        { _id: '1', name: 'Sarah Connor', email: 'sarah@clinic.com', contact: '+1-555-0199' },
        { _id: '2', name: 'John Doe', email: 'john.reception@clinic.com', contact: '+1-555-0188' }
      ]);
    } catch (error) {
      toast.error('Failed to load admin dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Smooth scroll routing mapping for sub-sections
  useEffect(() => {
    if (location.pathname === '/admin/doctors') {
      setTimeout(() => {
        document.getElementById('doctors-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else if (location.pathname === '/admin/receptionists') {
      setTimeout(() => {
        document.getElementById('receptionists-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else if (location.pathname === '/admin/subscription') {
      setTimeout(() => {
        document.getElementById('subscription-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [location.pathname]);

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setPlanForm({ name: plan.name, price: plan.price, features: plan.features });
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = () => {
    if (selectedPlan) {
      setPlans(plans.map(p => p.id === selectedPlan.id ? { ...p, ...planForm } : p));
      toast.success('Subscription plan updated successfully!');
    } else {
      setPlans([...plans, { id: Date.now(), ...planForm }]);
      toast.success('New Subscription plan created successfully!');
    }
    setIsPlanModalOpen(false);
    setSelectedPlan(null);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Command Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-slate-900/50 to-cyan-950/20 border border-white/[0.04] relative overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-30" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-[10px] font-bold tracking-widest font-mono uppercase">
              <Shield size={12} />
              Administrative Command Center
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight mt-1">
              Global Platform Metrics
            </h2>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed font-medium">
              Real-time monitoring of medical personnel load, AI clinical assistance metrics, platform throughput, and subscription pricing.
            </p>
          </div>
          <Button variant="outline" icon={RefreshCw} onClick={fetchData} className="border-white/[0.05] hover:border-indigo-500/30">
            Sync Telemetry Data
          </Button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Active Physicians"
          value={stats?.totalDoctors ?? 0}
          description="Verified and registered practitioners"
          icon={Stethoscope}
          trend={{ value: '+4', label: 'joined this month', isPositive: true }}
        />
        <Card
          title="Platform Enrolments"
          value={stats?.totalPatients ?? 0}
          description="Active patients registered in database"
          icon={Users}
          trend={{ value: '+14%', label: 'vs previous week', isPositive: true }}
        />
        <Card
          title="Scheduled Consultations"
          value={stats?.totalAppointments ?? 0}
          description="Active consultations currently queued"
          icon={Calendar}
          trend={{ value: 'OPTIMAL', label: 'workload index', isPositive: true }}
        />
      </div>

      {/* Futuristic Clinical AI & Telemetry Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Disease Telemetry */}
        <div className="p-6 bg-slate-950/40 border border-white/[0.035] rounded-3xl relative overflow-hidden backdrop-blur-xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                <Cpu size={18} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white tracking-wider uppercase font-mono">Clinical AI Telemetry</h3>
                <p className="text-xs text-slate-500 font-medium">Aggregated real-time health intelligence</p>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-bold uppercase rounded-lg font-mono">ACTIVE_ENGINE</span>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-950/80 border border-white/[0.03] rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider">Top Diagnosed Trend</p>
                <p className="text-base font-extrabold text-white mt-1">
                  {stats?.predictiveAnalytics?.commonDiseaseThisMonth || 'N/A (Pending patient clinical records)'}
                </p>
              </div>
              <span className="px-2.5 py-1 bg-indigo-550/10 border border-indigo-550/20 text-indigo-400 text-xs font-bold rounded-xl font-mono">INTELLIGENCE</span>
            </div>

            <div className="p-4 bg-slate-950/80 border border-white/[0.03] rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider">Active Patient Load Forecast</p>
                  <p className="text-base font-extrabold text-white mt-0.5">{stats?.predictiveAnalytics?.patientLoadForecast ?? 0} Consultations Scheduled</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">STABLE</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-white/[0.02] mt-3">
                <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-full rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Workload Trends */}
        <div className="p-6 bg-slate-950/40 border border-white/[0.035] rounded-3xl backdrop-blur-xl shadow-xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <BarChart2 size={18} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-wider uppercase font-mono">Physician Utilization Logs</h3>
              <p className="text-xs text-slate-500 font-medium">Completed clinical consultations telemetry</p>
            </div>
          </div>

          <div className="space-y-3.5 max-h-48 overflow-y-auto pr-1">
            {stats?.predictiveAnalytics?.doctorPerformanceTrends && stats.predictiveAnalytics.doctorPerformanceTrends.length > 0 ? (
              stats.predictiveAnalytics.doctorPerformanceTrends.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/80 border border-white/[0.03]">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 font-bold flex items-center justify-center text-xs font-mono border border-indigo-500/20">
                      #{idx + 1}
                    </div>
                    <span className="font-bold text-slate-200 text-sm">{doc.doctorName}</span>
                  </div>
                  <span className="text-xs font-mono font-bold bg-white/[0.03] border border-white/[0.06] px-3 py-1 text-slate-400 rounded-xl">
                    ⚡ {doc.completedCount} Consultations Done
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-xs text-slate-550 font-medium">No performance data compiled yet. Complete patient sessions to compile metrics.</p>
                <p className="text-[9px] text-slate-600 font-mono mt-1">TELEMETRY_IDLE</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Staff Management Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Doctors Section */}
        <div id="doctors-section" className="space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-550 animate-pulse" />
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider font-mono">Physician Registry</h3>
          </div>
          <Table headers={['Doctor Name', 'Email Address', 'Specialization']} isEmpty={doctors.length === 0} isLoading={loading}>
            {doctors.map((doc) => (
              <tr key={doc._id} className="hover:bg-white/[0.02] transition-colors border-b border-white/[0.02] last:border-0">
                <td className="px-6 py-4.5 font-bold text-slate-100 text-sm">{doc.name}</td>
                <td className="px-6 py-4.5 text-xs text-slate-450 font-mono font-medium">{doc.email}</td>
                <td className="px-6 py-4.5">
                  <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-[10px] font-bold uppercase rounded-lg tracking-wider font-mono">
                    {doc.specialty || 'General Practitioner'}
                  </span>
                </td>
              </tr>
            ))}
          </Table>
        </div>

        {/* Receptionists Section */}
        <div id="receptionists-section" className="space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-550 animate-pulse" />
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider font-mono">Reception Operations</h3>
          </div>
          <Table headers={['Operational Staff', 'Email Address', 'Contact Access']} isEmpty={receptionists.length === 0} isLoading={loading}>
            {receptionists.map((rec) => (
              <tr key={rec._id} className="hover:bg-white/[0.02] transition-colors border-b border-white/[0.02] last:border-0">
                <td className="px-6 py-4.5 font-bold text-slate-100 text-sm">{rec.name}</td>
                <td className="px-6 py-4.5 text-xs text-slate-450 font-mono font-medium">{rec.email}</td>
                <td className="px-6 py-4.5 text-xs font-mono font-bold text-slate-400">{rec.contact}</td>
              </tr>
            ))}
          </Table>
        </div>
      </div>

      {/* Simulated Subscription Plans Section */}
      <div id="subscription-section" className="p-6 bg-slate-950/40 border border-white/[0.035] rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="flex items-center justify-between mb-8 border-b border-white/[0.04] pb-5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
              <Award size={18} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-wider uppercase font-mono">Service Tier Configurations</h3>
              <p className="text-xs text-slate-500 font-medium">Define automated billing tiers & simulated client limits</p>
            </div>
          </div>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => { setSelectedPlan(null); setPlanForm({ name: '', price: '', features: '' }); setIsPlanModalOpen(true); }}>
            Configure New Tier
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {plans.map((plan) => (
            <div key={plan.id} className="p-6 rounded-3xl bg-slate-950/80 border border-white/[0.03] flex flex-col justify-between space-y-6 hover:border-indigo-500/20 transition-all duration-300 relative group overflow-hidden shadow-lg">
              {/* Subtle visual lighting inside plan */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-500/10 blur-xl rounded-full group-hover:bg-indigo-500/20 transition-all duration-300 pointer-events-none" />
              
              <div className="space-y-4">
                <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-[9px] font-bold uppercase rounded-lg tracking-wider font-mono">
                  ACTIVE_TIER
                </span>
                <h4 className="text-lg font-extrabold text-white mt-3 tracking-tight">{plan.name}</h4>
                <p className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-cyan-300 tracking-tight">{plan.price}</p>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed font-semibold">{plan.features}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleEditPlan(plan)} className="w-full border-white/[0.04] hover:bg-indigo-550/15">
                Configure Pricing Settings
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Plan modification Modal */}
      <Modal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)} title={selectedPlan ? 'Configure Service Plan Details' : 'Configure Custom Service Plan'}>
        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Plan Descriptor</label>
            <input
              type="text"
              value={planForm.name}
              onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
              className="w-full bg-slate-950 text-white rounded-xl py-3.5 px-4 border border-white/[0.04] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-300 font-semibold text-sm"
              placeholder="e.g. AI Enterprise Tier"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Billing Rate</label>
            <input
              type="text"
              value={planForm.price}
              onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
              className="w-full bg-slate-950 text-white rounded-xl py-3.5 px-4 border border-white/[0.04] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-300 font-semibold text-sm"
              placeholder="e.g. $199/mo"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Included Features Telemetry</label>
            <textarea
              value={planForm.features}
              onChange={(e) => setPlanForm({ ...planForm, features: e.target.value })}
              className="w-full bg-slate-950 text-white rounded-xl py-3.5 px-4 border border-white/[0.04] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-300 h-24 resize-none font-semibold text-sm"
              placeholder="List features..."
            />
          </div>
          <div className="flex justify-end space-x-3 pt-5 border-t border-white/[0.04]">
            <Button variant="outline" onClick={() => setIsPlanModalOpen(false)}>Discard</Button>
            <Button variant="primary" onClick={handleSavePlan}>Commit Configurations</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
