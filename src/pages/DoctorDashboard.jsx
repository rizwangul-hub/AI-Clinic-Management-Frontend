import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '../components/Card';
import { Table } from '../components/Table';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { clinicService } from '../services/api/clinicService';
import { Calendar, Clipboard, FileText, CheckCircle2, User, Activity, AlertTriangle, Plus, Trash2, ShieldAlert, BookOpen, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DoctorDashboard() {
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedPatientName, setSelectedPatientName] = useState('');
  const [history, setHistory] = useState(null);
  
  // Modals state
  const [isDiagnosisOpen, setIsDiagnosisOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Form states
  const [diagnosisForm, setDiagnosisForm] = useState({
    symptoms: '',
    diagnosis: '',
    notes: '',
    riskLevel: 'low',
  });

  const [prescriptionForm, setPrescriptionForm] = useState({
    instructions: '',
  });
  const [medicines, setMedicines] = useState([{ medicineName: '', dosage: '', duration: '' }]);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const data = await clinicService.getDoctorSchedule();
      setAppointments(data.appointments || []);
    } catch (error) {
      toast.error('Failed to load today\'s appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  // Smooth scroll routing mapping for sub-sections
  useEffect(() => {
    if (location.pathname === '/doctor/appointments' || location.pathname === '/doctor/history') {
      setTimeout(() => {
        document.getElementById('appointments-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [location.pathname]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await clinicService.updateAppointmentStatus(id, status);
      toast.success(`Appointment marked as ${status}!`);
      fetchSchedule();
    } catch (error) {
      toast.error('Failed to update appointment status.');
    }
  };

  const handleOpenDiagnosis = (patientId, patientName) => {
    setSelectedPatientId(patientId);
    setSelectedPatientName(patientName);
    setDiagnosisForm({ symptoms: '', diagnosis: '', notes: '', riskLevel: 'low' });
    setIsDiagnosisOpen(true);
  };

  const handleOpenPrescription = (patientId, patientName) => {
    setSelectedPatientId(patientId);
    setSelectedPatientName(patientName);
    setPrescriptionForm({ instructions: '' });
    setMedicines([{ medicineName: '', dosage: '', duration: '' }]);
    setIsPrescriptionOpen(true);
  };

  const handleOpenHistory = async (patientId, patientName) => {
    setSelectedPatientId(patientId);
    setSelectedPatientName(patientName);
    setIsHistoryOpen(true);
    try {
      const data = await clinicService.getPatientHistory(patientId);
      setHistory(data);
    } catch (error) {
      toast.error('Failed to load patient medical records.');
    }
  };

  // Medicine array management
  const addMedicineRow = () => {
    setMedicines([...medicines, { medicineName: '', dosage: '', duration: '' }]);
  };

  const removeMedicineRow = (idx) => {
    setMedicines(medicines.filter((_, i) => i !== idx));
  };

  const handleMedicineChange = (idx, field, val) => {
    const updated = medicines.map((med, i) => i === idx ? { ...med, [field]: val } : med);
    setMedicines(updated);
  };

  const submitDiagnosis = async () => {
    if (!diagnosisForm.symptoms || !diagnosisForm.diagnosis) {
      return toast.error('Please enter symptoms and diagnosis.');
    }
    try {
      await clinicService.addDiagnosis({
        patient: selectedPatientId,
        ...diagnosisForm,
      });
      toast.success('Diagnosis added successfully!');
      setIsDiagnosisOpen(false);
    } catch (error) {
      toast.error('Failed to save diagnosis.');
    }
  };

  const submitPrescription = async () => {
    const emptyMed = medicines.some(m => !m.medicineName || !m.dosage || !m.duration);
    if (emptyMed) {
      return toast.error('Please fill out all medicine fields.');
    }
    try {
      await clinicService.addPrescription({
        patient: selectedPatientId,
        medicines,
        instructions: prescriptionForm.instructions,
      });
      toast.success('Prescription generated successfully!');
      setIsPrescriptionOpen(false);
    } catch (error) {
      toast.error('Failed to save prescription.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Clinician Overview Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0a122c] via-slate-900/60 to-[#0c243a]/25 border border-white/[0.04] relative overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold tracking-widest font-mono uppercase rounded-full">
              ⚡ Physician Portal Active
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mt-3">
              Clinical Workspace
            </h2>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed font-semibold">
              Manage patient clinical queues, update clinical diagnostics, prescribe treatment plans, and consult AI prediction assistance.
            </p>
          </div>
          <div className="flex items-center space-x-2.5 bg-slate-950/45 px-4.5 py-2.5 border border-white/[0.04] rounded-2xl">
            <Clock size={15} className="text-slate-500" />
            <span className="text-xs font-bold text-slate-350 tracking-wider uppercase font-mono">Duty Status: Online</span>
          </div>
        </div>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Consulations Scheduled"
          value={appointments.length}
          description="Total diagnostic sessions queued"
          icon={Calendar}
        />
        <Card
          title="Pending Operations"
          value={appointments.filter(a => a.status === 'scheduled').length}
          description="Awaiting patient evaluation"
          icon={Activity}
        />
        <Card
          title="Completed Consultations"
          value={appointments.filter(a => a.status === 'completed').length}
          description="Patients successfully treated today"
          icon={CheckCircle2}
        />
      </div>

      {/* Main Appointments Pipeline */}
      <div id="appointments-section" className="space-y-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          <h3 className="text-base font-extrabold text-white uppercase tracking-wider font-mono">Today's Diagnostic Pipeline</h3>
        </div>

        <Table
          headers={['Patient Telemetry', 'Scheduled Slot', 'Platform Status', 'Clinical Operations']}
          isEmpty={appointments.length === 0}
          isLoading={loading}
        >
          {appointments.map((appt) => (
            <tr key={appt._id} className="hover:bg-white/[0.015] transition-colors border-b border-white/[0.02] last:border-0">
              <td className="px-6 py-4.5">
                <div className="flex items-center space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-white/[0.04] flex items-center justify-center text-slate-350 shadow-inner">
                    <User size={15} />
                  </div>
                  <div>
                    <span className="font-bold text-white block text-sm leading-none mb-1">{appt.patient?.name || 'Walk-in Patient'}</span>
                    <span className="text-[10px] text-slate-500 font-mono font-medium">{appt.patient?.email || 'N/A'}</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4.5">
                <span className="text-slate-300 text-xs font-mono font-bold uppercase tracking-wider">{appt.slot || 'Pending Slot'}</span>
              </td>
              <td className="px-6 py-4.5">
                <span className={`px-2.5 py-1 text-[9px] font-extrabold uppercase rounded-lg border ${
                  appt.status === 'completed'
                    ? 'bg-emerald-550/10 border-emerald-500/20 text-emerald-400'
                    : appt.status === 'cancelled'
                    ? 'bg-rose-550/10 border-rose-500/20 text-rose-450'
                    : 'bg-amber-550/10 border-amber-500/20 text-amber-450'
                }`}>
                  {appt.status}
                </span>
              </td>
              <td className="px-6 py-4.5 space-x-2.5">
                {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                  <>
                    <Button variant="success" size="sm" onClick={() => handleUpdateStatus(appt._id, 'completed')}>
                      Complete Session
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Clipboard}
                      onClick={() => handleOpenDiagnosis(appt.patient?._id, appt.patient?.name)}
                    >
                      Diagnose Patient
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={FileText}
                      onClick={() => handleOpenPrescription(appt.patient?._id, appt.patient?.name)}
                    >
                      Prescribe
                    </Button>
                  </>
                )}
                {appt.patient?._id && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenHistory(appt.patient._id, appt.patient.name)}
                  >
                    View EHR Chart
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </Table>
      </div>

      {/* --- ADD DIAGNOSIS MODAL --- */}
      <Modal isOpen={isDiagnosisOpen} onClose={() => setIsDiagnosisOpen(false)} title={`Diagnose Patient: ${selectedPatientName}`}>
        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Observed Symptoms</label>
            <input
              type="text"
              value={diagnosisForm.symptoms}
              onChange={(e) => setDiagnosisForm({ ...diagnosisForm, symptoms: e.target.value })}
              className="w-full bg-slate-950 text-white rounded-xl py-3.5 px-4 border border-white/[0.04] focus:border-indigo-500 outline-none transition-all duration-300 font-semibold text-sm"
              placeholder="e.g. Dry Cough, High Fever"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Clinical Diagnosis</label>
            <input
              type="text"
              value={diagnosisForm.diagnosis}
              onChange={(e) => setDiagnosisForm({ ...diagnosisForm, diagnosis: e.target.value })}
              className="w-full bg-slate-950 text-white rounded-xl py-3.5 px-4 border border-white/[0.04] focus:border-indigo-500 outline-none transition-all duration-300 font-semibold text-sm"
              placeholder="e.g. Acute Bronchitis"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Severity Risk Index</label>
            <select
              value={diagnosisForm.riskLevel}
              onChange={(e) => setDiagnosisForm({ ...diagnosisForm, riskLevel: e.target.value })}
              className="w-full bg-slate-950 text-white rounded-xl py-3.5 px-4 border border-white/[0.04] focus:border-indigo-500 outline-none cursor-pointer font-bold text-xs uppercase"
            >
              <option value="low">Low Severity</option>
              <option value="medium">Medium Severity</option>
              <option value="high">High Severity Alert</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Detailed Clinical Notes</label>
            <textarea
              value={diagnosisForm.notes}
              onChange={(e) => setDiagnosisForm({ ...diagnosisForm, notes: e.target.value })}
              className="w-full bg-slate-950 text-white rounded-xl py-3.5 px-4 border border-white/[0.04] focus:border-indigo-500 outline-none transition-all duration-300 h-24 resize-none font-semibold text-sm"
              placeholder="Assess treatment pathway details..."
            />
          </div>
          <div className="flex justify-end space-x-3 pt-5 border-t border-white/[0.04]">
            <Button variant="outline" onClick={() => setIsDiagnosisOpen(false)}>Discard</Button>
            <Button variant="success" onClick={submitDiagnosis}>Save Diagnosis</Button>
          </div>
        </div>
      </Modal>

      {/* --- WRITE PRESCRIPTION MODAL --- */}
      <Modal isOpen={isPrescriptionOpen} onClose={() => setIsPrescriptionOpen(false)} title={`Create Treatment Prescription: ${selectedPatientName}`}>
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.03] pb-3 mb-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Medicines Catalog</label>
            <Button variant="outline" size="sm" icon={Plus} onClick={addMedicineRow} className="text-xs uppercase font-bold tracking-wider">Add Formulation</Button>
          </div>

          <div className="space-y-3.5 max-h-48 overflow-y-auto pr-1">
            {medicines.map((med, idx) => (
              <div key={idx} className="flex items-center space-x-3 bg-slate-950/80 p-3.5 rounded-2xl border border-white/[0.03]">
                <input
                  type="text"
                  placeholder="Medicine Formulation"
                  value={med.medicineName}
                  onChange={(e) => handleMedicineChange(idx, 'medicineName', e.target.value)}
                  className="flex-1 bg-slate-900 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 border border-white/[0.02] font-semibold"
                />
                <input
                  type="text"
                  placeholder="Dosage (e.g. 500mg)"
                  value={med.dosage}
                  onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                  className="w-28 bg-slate-900 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 border border-white/[0.02] font-semibold"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g. 5 Days)"
                  value={med.duration}
                  onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                  className="w-28 bg-slate-900 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 border border-white/[0.02] font-semibold"
                />
                {medicines.length > 1 && (
                  <button onClick={() => removeMedicineRow(idx)} className="p-2 text-rose-500 hover:bg-slate-900 rounded-xl transition-colors border border-transparent hover:border-rose-550/15">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Special Directives</label>
            <textarea
              value={prescriptionForm.instructions}
              onChange={(e) => setPrescriptionForm({ ...prescriptionForm, instructions: e.target.value })}
              className="w-full bg-slate-950 text-white rounded-xl py-3.5 px-4 border border-white/[0.04] focus:border-indigo-500 outline-none transition-all duration-300 h-20 resize-none font-semibold text-sm"
              placeholder="Instructions regarding meals, resting schedules, etc."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-5 border-t border-white/[0.04]">
            <Button variant="outline" onClick={() => setIsPrescriptionOpen(false)}>Discard</Button>
            <Button variant="primary" onClick={submitPrescription}>Commit Treatment</Button>
          </div>
        </div>
      </Modal>

      {/* --- PATIENT CHART HISTORY TIMELINE MODAL --- */}
      <Modal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} title={`Electronic Health Record: ${selectedPatientName}`}>
        <div className="space-y-6">
          {/* Diagnoses */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 font-mono border-b border-white/[0.03] pb-2">
              <Clipboard size={14} className="text-indigo-400" />
              Diagnoses Timeline
            </h4>
            <div className="space-y-3.5 max-h-48 overflow-y-auto pr-1">
              {history?.diagnosis && history.diagnosis.length > 0 ? (
                history.diagnosis.map((diag, i) => (
                  <div key={i} className="p-4 bg-slate-950 border border-white/[0.03] rounded-2xl relative overflow-hidden shadow-inner">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-white">{diag.diagnosis}</span>
                      <span className={`px-2.5 py-0.5 text-[8px] font-bold uppercase rounded-full border ${
                        diag.riskLevel === 'high' 
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                          : 'bg-indigo-550/10 border-indigo-500/20 text-indigo-400'
                      }`}>
                        {diag.riskLevel} severity
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 font-semibold">Symptoms: <span className="text-slate-200">{diag.symptoms}</span></p>
                    {diag.notes && <p className="text-xs text-slate-500 mt-1 italic">Clinical Notes: {diag.notes}</p>}
                    <span className="text-[9px] text-slate-600 font-mono block mt-2.5">{new Date(diag.createdAt).toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 font-medium italic text-center py-6">No diagnostic telemetry logged yet.</p>
              )}
            </div>
          </div>

          {/* Prescriptions */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 font-mono border-b border-white/[0.03] pb-2">
              <FileText size={14} className="text-emerald-400" />
              Treatment Formulary
            </h4>
            <div className="space-y-3.5 max-h-48 overflow-y-auto pr-1">
              {history?.prescriptions && history.prescriptions.length > 0 ? (
                history.prescriptions.map((pres, i) => (
                  <div key={i} className="p-4 bg-slate-950 border border-white/[0.03] rounded-2xl shadow-inner space-y-2.5">
                    <div className="space-y-1">
                      {pres.medicines?.map((med, k) => (
                        <p key={k} className="text-xs text-slate-200 font-bold">
                          💊 {med.medicineName} — <span className="text-slate-500 font-mono text-[10px] font-semibold">{med.dosage} ({med.duration})</span>
                        </p>
                      ))}
                    </div>
                    {pres.instructions && <p className="text-xs text-slate-400 italic font-semibold">Instructions: {pres.instructions}</p>}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 font-medium italic text-center py-6">No treatment prescriptions issued yet.</p>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
