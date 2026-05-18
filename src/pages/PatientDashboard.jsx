import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext/AuthContext';
import { clinicService } from '../services/api/clinicService';
import { Heart, Calendar, Clipboard, FileText, Download, Activity, User, Award, Shield, FileCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PatientDashboard() {
  const location = useLocation();
  const { user } = useAuth();
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await clinicService.getPatientHistory(user.id);
      setHistory(data);
    } catch (error) {
      toast.error('Failed to retrieve medical record details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  // Smooth scroll routing mapping for sub-sections
  useEffect(() => {
    if (location.pathname === '/patient/appointments' || location.pathname === '/patient/history') {
      setTimeout(() => {
        document.getElementById('timeline-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else if (location.pathname === '/patient/prescriptions') {
      setTimeout(() => {
        document.getElementById('prescriptions-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [location.pathname]);

  const handleDownloadPDF = async (presId) => {
    try {
      toast.loading('Generating PDF Document...', { id: 'pdf-toast' });
      const blob = await clinicService.downloadPrescriptionPDF(presId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescription-${presId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success('Prescription downloaded successfully!', { id: 'pdf-toast' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to download prescription PDF.', { id: 'pdf-toast' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Patient Profile Header Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-cyan-950/20 border border-white/[0.04] relative overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-30" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-indigo-550 to-cyan-550 rounded-2xl flex items-center justify-center text-white font-black shadow-lg">
              <User size={24} />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-2xl font-extrabold text-white tracking-tight leading-none mb-1">{user?.name}</h2>
                <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 font-mono text-[9px] font-bold uppercase rounded-full shadow-sm tracking-wider">
                  Patient Profile
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1.5 font-semibold font-mono leading-none">{user?.email}</p>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Current Subscription Plan</p>
            <p className="text-sm font-extrabold text-white mt-1 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent uppercase tracking-wider">
              🏆 {user?.subscriptionPlan || 'Free Starter'} Member
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Consultation Sessions"
          value={history?.appointments?.length ?? 0}
          description="Schedules consultation slots with clinic physicians"
          icon={Calendar}
        />
        <Card
          title="Active Diagnoses"
          value={history?.diagnosis?.length ?? 0}
          description="Assessed medical telemetry entries"
          icon={Clipboard}
        />
        <Card
          title="Written Prescriptions"
          value={history?.prescriptions?.length ?? 0}
          description="Medical prescriptions generated to you"
          icon={FileText}
        />
      </div>

      {/* Linear Medical History Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline View */}
        <div id="timeline-section" className="lg:col-span-2 bg-slate-950/40 border border-white/[0.035] rounded-3xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent pointer-events-none" />
          <h3 className="text-sm font-extrabold text-white tracking-widest uppercase mb-6 flex items-center gap-2.5 font-mono">
            <Activity className="text-cyan-400" size={16} />
            Your Medical History Timeline
          </h3>

          {loading ? (
            <div className="text-center py-14">
              <div className="inline-flex items-center space-x-2 text-indigo-405 animate-pulse">
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" />
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs font-bold font-mono tracking-widest uppercase ml-2 text-slate-500">Retrieving EHR records...</span>
              </div>
            </div>
          ) : (!history?.appointments?.length && !history?.diagnosis?.length && !history?.prescriptions?.length) ? (
            <div className="text-center py-14">
              <p className="text-sm font-semibold text-slate-400">Your clinical medical timeline is completely empty.</p>
              <p className="text-[10px] text-slate-600 font-mono mt-1">EHR_RECORD_EMPTY</p>
            </div>
          ) : (
            <div className="relative pl-6 border-l border-white/[0.04] space-y-8 py-2">
              {/* Combine and sort diagnosis, appointments, prescriptions */}
              {[
                ...(history.diagnosis || []).map(d => ({ ...d, type: 'diagnosis', date: new Date(d.createdAt) })),
                ...(history.appointments || []).map(a => ({ ...a, type: 'appointment', date: new Date(a.date) })),
                ...(history.prescriptions || []).map(p => ({ ...p, type: 'prescription', date: new Date(p.createdAt) }))
              ]
                .sort((a, b) => b.date - a.date)
                .map((item, idx) => {
                  return (
                    <div key={idx} className="relative group">
                      {/* Bullet icon */}
                      <span className={`absolute -left-[30px] top-1.5 p-1 rounded-xl border border-slate-950 ${
                        item.type === 'diagnosis' ? 'bg-indigo-500 text-white border-indigo-400/20' : item.type === 'prescription' ? 'bg-emerald-500 text-white border-emerald-400/20' : 'bg-cyan-550 text-white border-cyan-400/20'
                      } shadow-[0_0_10px_rgba(99,102,241,0.1)]`}>
                        {item.type === 'diagnosis' ? <Clipboard size={10} /> : item.type === 'prescription' ? <FileText size={10} /> : <Calendar size={10} />}
                      </span>

                      {/* Content panel */}
                      <div className="p-4 bg-slate-950/80 hover:bg-slate-950 border border-white/[0.03] rounded-2xl transition-all duration-300 relative overflow-hidden group shadow-md hover:border-indigo-500/10">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase font-mono border ${
                            item.type === 'diagnosis'
                              ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                              : item.type === 'prescription'
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                              : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                          }`}>{item.type}</span>
                          <span className="text-[10px] text-slate-500 font-mono font-medium">{item.date.toLocaleDateString()}</span>
                        </div>

                        {item.type === 'diagnosis' && (
                          <div className="mt-3.5 space-y-1.5">
                            <p className="text-sm font-extrabold text-white">{item.diagnosis}</p>
                            <p className="text-xs text-slate-400 font-medium">Symptoms: <span className="text-slate-200">{item.symptoms}</span></p>
                            {item.notes && <p className="text-xs text-slate-500 italic mt-1 font-semibold">Notes: {item.notes}</p>}
                          </div>
                        )}

                        {item.type === 'prescription' && (
                          <div className="mt-3.5 space-y-3.5">
                            <div className="space-y-1.5">
                              {item.medicines?.map((m, k) => (
                                <p key={k} className="text-xs text-slate-200 font-bold">
                                  💊 {m.medicineName} — <span className="text-slate-550 font-mono text-[10px] font-semibold">{m.dosage} ({m.duration})</span>
                                </p>
                              ))}
                            </div>
                            {item.instructions && <p className="text-xs text-slate-450 italic font-semibold">Special Instructions: {item.instructions}</p>}
                            <div className="pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                icon={Download}
                                onClick={() => handleDownloadPDF(item._id)}
                                className="text-xs uppercase font-bold tracking-wider"
                              >
                                Download Prescription PDF
                              </Button>
                            </div>
                          </div>
                        )}

                        {item.type === 'appointment' && (
                          <div className="mt-3.5 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-extrabold text-white">Consultation Slot</p>
                              <span className="text-xs text-slate-500 font-semibold font-mono">Slot: {item.time}</span>
                            </div>
                            <span className={`px-2.5 py-0.5 text-[9px] font-bold uppercase rounded-lg border ${
                              item.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-450' : 'bg-amber-500/10 border-amber-500/20 text-amber-450'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Prescriptions quick actions list */}
        <div id="prescriptions-section" className="bg-slate-950/40 border border-white/[0.035] rounded-3xl p-6 backdrop-blur-xl h-fit shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent pointer-events-none" />
          <h3 className="text-sm font-extrabold text-white tracking-widest uppercase mb-5 flex items-center gap-2.5 font-mono">
            <Award className="text-indigo-400" size={16} />
            Quick Prescriptions Panel
          </h3>

          <div className="space-y-4">
            {history?.prescriptions && history.prescriptions.length > 0 ? (
              history.prescriptions.map((pres, idx) => (
                <div key={idx} className="p-4 bg-slate-955/80 border border-white/[0.03] rounded-2xl flex flex-col space-y-3.5 shadow-inner">
                  <div className="flex items-center justify-between border-b border-white/[0.02] pb-2">
                    <div className="flex items-center space-x-2">
                      <FileCheck size={14} className="text-emerald-450" />
                      <span className="text-xs font-mono font-bold text-slate-400">Prescription #{idx + 1}</span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono font-medium">{new Date(pres.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="space-y-1.5">
                    {pres.medicines?.map((med, k) => (
                      <div key={k} className="flex justify-between items-center bg-white/[0.01] p-2 rounded-xl border border-white/[0.02]">
                        <span className="text-xs font-bold text-slate-200">{med.medicineName}</span>
                        <span className="text-[10px] text-slate-500 font-mono font-semibold">{med.dosage} ({med.duration})</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    icon={Download}
                    onClick={() => handleDownloadPDF(pres._id)}
                    className="w-full text-xs uppercase font-bold tracking-wider"
                  >
                    Download Medical PDF
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-xs text-slate-500 font-medium italic">No clinical prescriptions loaded.</p>
                <p className="text-[9px] text-slate-655 font-mono mt-1">PRESCRIPTIONS_VOID</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
