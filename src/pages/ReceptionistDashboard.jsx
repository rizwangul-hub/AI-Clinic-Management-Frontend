import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Table } from '../components/Table';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { clinicService } from '../services/api/clinicService';
import { UserPlus, CalendarRange, Clock, Users, Calendar, Plus, User, Edit, Trash2, Check, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReceptionistDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Selected entities
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  // Forms state
  const [patientForm, setPatientForm] = useState({
    name: '',
    email: '',
    password: 'Password123!', // default password for registered patients
    age: '',
    gender: 'Male',
    contact: '',
  });

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    age: '',
    gender: 'Male',
    contact: '',
  });

  const [bookingForm, setBookingForm] = useState({
    patient: '',
    doctor: '',
    date: '',
    time: '',
  });

  // Track Sidebar path redirects to auto-open corresponding modals
  useEffect(() => {
    if (location.pathname === '/receptionist/patients') {
      setIsRegisterOpen(true);
      setIsBookOpen(false);
    } else if (location.pathname === '/receptionist/book') {
      setIsBookOpen(true);
      setIsRegisterOpen(false);
    } else {
      setIsRegisterOpen(false);
      setIsBookOpen(false);
    }
  }, [location.pathname]);

  const loadData = async () => {
    setLoading(true);
    try {
      const patientsData = await clinicService.getPatients();
      setPatients(patientsData.patients || []);

      const docsData = await clinicService.getAdminDoctors();
      setDoctors(docsData.doctors || []);

      const apptsData = await clinicService.getAllAppointments();
      setAppointments(apptsData.appointments || []);
    } catch (error) {
      toast.error('Failed to load receptionist dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRegisterPatient = async () => {
    if (!patientForm.name || !patientForm.email || !patientForm.age || !patientForm.contact) {
      return toast.error('Please fill out all patient registration fields.');
    }
    try {
      await clinicService.addPatient(patientForm);
      toast.success('Patient registered successfully!');
      setIsRegisterOpen(false);
      navigate('/receptionist');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Patient registration failed.');
    }
  };

  const handleEditPatient = async () => {
    if (!editForm.name || !editForm.email || !editForm.age || !editForm.contact) {
      return toast.error('Please fill out all patient fields.');
    }
    try {
      await clinicService.editPatient(selectedPatientId, editForm);
      toast.success('Patient record updated successfully!');
      setIsEditOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update patient record.');
    }
  };

  const handleBookAppointment = async () => {
    if (!bookingForm.patient || !bookingForm.doctor || !bookingForm.date || !bookingForm.time) {
      return toast.error('Please fill out all booking details.');
    }
    try {
      await clinicService.bookAppointment(bookingForm);
      toast.success('Appointment booked successfully!');
      setIsBookOpen(false);
      navigate('/receptionist');
      loadData();
    } catch (error) {
      toast.error('Failed to book appointment.');
    }
  };

  const handleCancelAppointment = async (id) => {
    try {
      await clinicService.cancelAppointment(id);
      toast.success('Appointment cancelled successfully!');
      loadData();
    } catch (error) {
      toast.error('Failed to cancel appointment.');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await clinicService.updateAppointmentStatus(id, status);
      toast.success(`Appointment marked as ${status}!`);
      loadData();
    } catch (error) {
      toast.error('Failed to update status.');
    }
  };

  const openEditModal = (pat) => {
    setSelectedPatientId(pat._id);
    setEditForm({
      name: pat.name,
      email: pat.email,
      age: pat.age,
      gender: pat.gender || 'Male',
      contact: pat.contact,
    });
    setIsEditOpen(true);
  };

  const handleCloseRegisterModal = () => {
    setIsRegisterOpen(false);
    navigate('/receptionist');
  };

  const handleCloseBookModal = () => {
    setIsBookOpen(false);
    navigate('/receptionist');
  };

  return (
    <div className="space-y-8">
      {/* Frontdesk Operations Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-cyan-950/20 border border-white/[0.04] relative overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="px-3.5 py-1.5 bg-emerald-550/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-widest font-mono uppercase rounded-full">
              🟢 Frontdesk Deck Operational
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mt-3">
              Operations Control Panel
            </h2>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed font-semibold">
              Register clinical patients, coordinate consultant scheduling, manage operational timelines, and monitor clinical checkins.
            </p>
          </div>
          <div className="flex items-center space-x-3.5">
            <Button variant="success" icon={UserPlus} onClick={() => setIsRegisterOpen(true)}>
              Register Patient
            </Button>
            <Button variant="primary" icon={Calendar} onClick={() => setIsBookOpen(true)}>
              Schedule Consultation
            </Button>
          </div>
        </div>
      </div>

      {/* Receptionist Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Active Registered Patients"
          value={patients.length}
          description="Total enrolled clinical database profiles"
          icon={Users}
        />
        <Card
          title="Physicians Enrolled"
          value={doctors.length}
          description="Practitioners ready for consultation matching"
          icon={CalendarRange}
        />
        <Card
          title="Active Consultations"
          value={appointments.length}
          description="Total daily consultation schedules"
          icon={Clock}
        />
      </div>

      {/* Main Grid: Patient Profiles and Consultation Schedules */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Patient Profiles Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-base font-extrabold text-white uppercase tracking-wider font-mono">Patient Directory</h3>
            </div>
            <Button variant="outline" size="sm" icon={RefreshCw} onClick={loadData} className="text-xs uppercase font-mono tracking-widest border-white/[0.04] hover:bg-slate-900" />
          </div>

          <Table headers={['Patient Profile', 'Metrics', 'Actions']} isEmpty={patients.length === 0} isLoading={loading}>
            {patients.map((pat) => (
              <tr key={pat._id} className="hover:bg-white/[0.015] transition-colors border-b border-white/[0.02] last:border-0">
                <td className="px-6 py-4.5">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-white/[0.04] flex items-center justify-center text-slate-350">
                      <User size={15} />
                    </div>
                    <div>
                      <span className="font-bold text-white block text-sm leading-none mb-1">{pat.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono font-medium">{pat.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4.5 font-mono text-xs">
                  <div className="space-y-1">
                    <p className="text-slate-300">Age: <span className="text-slate-450 font-bold">{pat.age}</span></p>
                    <p className="text-slate-500 font-medium">{pat.contact}</p>
                  </div>
                </td>
                <td className="px-6 py-4.5 space-x-2.5">
                  <Button variant="secondary" size="sm" icon={Edit} onClick={() => openEditModal(pat)}>
                    Edit Profile
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        </div>

        {/* Schedules Grid */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider font-mono">Consultation Registry</h3>
          </div>

          <Table headers={['Operational Slot', 'Assigned Practitioner', 'Status Flags', 'Administrative']} isEmpty={appointments.length === 0} isLoading={loading}>
            {appointments.map((appt) => (
              <tr key={appt._id} className="hover:bg-white/[0.015] transition-colors border-b border-white/[0.02] last:border-0">
                <td className="px-6 py-4.5">
                  <div className="space-y-1 font-mono">
                    <span className="font-bold text-slate-200 block text-xs">{appt.patient?.name || 'Walk-in Patient'}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{appt.date ? new Date(appt.date).toLocaleDateString() : ''} - {appt.time}</span>
                  </div>
                </td>
                <td className="px-6 py-4.5">
                  <span className="text-slate-350 text-xs font-semibold">{appt.doctor?.name || 'Assigned Doctor'}</span>
                </td>
                <td className="px-6 py-4.5">
                  <span className={`px-2.5 py-1 text-[9px] font-extrabold uppercase rounded-lg border ${
                    appt.status === 'completed'
                      ? 'bg-emerald-555/10 border-emerald-500/20 text-emerald-400'
                      : appt.status === 'cancelled'
                      ? 'bg-rose-555/10 border-rose-500/20 text-rose-455'
                      : 'bg-amber-555/10 border-amber-500/20 text-amber-455'
                  }`}>
                    {appt.status}
                  </span>
                </td>
                <td className="px-6 py-4.5 space-x-2.5">
                  {appt.status === 'scheduled' && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(appt._id, 'completed')}>
                        Complete
                      </Button>
                      <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleCancelAppointment(appt._id)}>
                        Cancel Slot
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </Table>
        </div>
      </div>

      {/* --- REGISTER NEW PATIENT MODAL --- */}
      <Modal isOpen={isRegisterOpen} onClose={handleCloseRegisterModal} title="Register New Patient Record">
        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Full Name</label>
            <input
              type="text"
              value={patientForm.name}
              onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
              className="w-full bg-slate-950 text-white rounded-xl py-3.5 px-4 border border-white/[0.04] focus:border-indigo-500 outline-none transition-all duration-300 font-semibold text-sm"
              placeholder="e.g. Alice Walker"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Email Address</label>
            <input
              type="email"
              value={patientForm.email}
              onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
              className="w-full bg-slate-950 text-white rounded-xl py-3.5 px-4 border border-white/[0.04] focus:border-indigo-500 outline-none transition-all duration-300 font-semibold text-sm"
              placeholder="alice@email.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Patient Age</label>
              <input
                type="number"
                value={patientForm.age}
                onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
                className="w-full bg-slate-950 text-white rounded-xl py-3.5 px-4 border border-white/[0.04] focus:border-indigo-500 outline-none transition-all duration-300 font-semibold text-sm"
                placeholder="Age"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Gender Identification</label>
              <select
                value={patientForm.gender}
                onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
                className="w-full bg-slate-950 text-white rounded-xl py-3.5 px-4 border border-white/[0.04] focus:border-indigo-500 outline-none font-bold text-xs uppercase cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Contact Access Number</label>
            <input
              type="text"
              value={patientForm.contact}
              onChange={(e) => setPatientForm({ ...patientForm, contact: e.target.value })}
              className="w-full bg-slate-950 text-white rounded-xl py-3.5 px-4 border border-white/[0.04] focus:border-indigo-500 outline-none transition-all duration-300 font-semibold text-sm"
              placeholder="+1-555-0199"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-5 border-t border-white/[0.04]">
            <Button variant="outline" onClick={handleCloseRegisterModal}>Cancel</Button>
            <Button variant="success" onClick={handleRegisterPatient}>Register Record</Button>
          </div>
        </div>
      </Modal>

      {/* --- EDIT PATIENT MODAL --- */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Modify Patient Profile Record">
        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Full Name</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full bg-slate-950 text-white rounded-xl py-3.5 px-4 border border-white/[0.04] focus:border-indigo-500 outline-none transition-all duration-300 font-semibold text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Email Address</label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="w-full bg-slate-950 text-white rounded-xl py-3.5 px-4 border border-white/[0.04] focus:border-indigo-500 outline-none transition-all duration-300 font-semibold text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Patient Age</label>
              <input
                type="number"
                value={editForm.age}
                onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                className="w-full bg-slate-950 text-white rounded-xl py-3.5 px-4 border border-white/[0.04] focus:border-indigo-500 outline-none transition-all duration-300 font-semibold text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Gender Identification</label>
              <select
                value={editForm.gender}
                onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                className="w-full bg-slate-950 text-white rounded-xl py-3.5 px-4 border border-white/[0.04] focus:border-indigo-500 outline-none font-bold text-xs uppercase cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Contact Access Number</label>
            <input
              type="text"
              value={editForm.contact}
              onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })}
              className="w-full bg-slate-950 text-white rounded-xl py-3.5 px-4 border border-white/[0.04] focus:border-indigo-500 outline-none transition-all duration-300 font-semibold text-sm"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-5 border-t border-white/[0.04]">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Discard</Button>
            <Button variant="primary" onClick={handleEditPatient}>Update Record</Button>
          </div>
        </div>
      </Modal>

      {/* --- BOOK APPOINTMENT MODAL --- */}
      <Modal isOpen={isBookOpen} onClose={handleCloseBookModal} title="Schedule Consultation Slot">
        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Assign Patient Profile</label>
            <select
              value={bookingForm.patient}
              onChange={(e) => setBookingForm({ ...bookingForm, patient: e.target.value })}
              className="w-full bg-slate-950 text-white rounded-xl py-3.5 px-4 border border-white/[0.04] focus:border-indigo-500 outline-none font-bold text-xs uppercase cursor-pointer"
            >
              <option value="">Select Enrolled Patient Profile</option>
              {patients.map((pat) => (
                <option key={pat._id} value={pat._id}>
                  {pat.name} ({pat.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Assign Clinic Physician</label>
            <select
              value={bookingForm.doctor}
              onChange={(e) => setBookingForm({ ...bookingForm, doctor: e.target.value })}
              className="w-full bg-slate-950 text-white rounded-xl py-3.5 px-4 border border-white/[0.04] focus:border-indigo-500 outline-none font-bold text-xs uppercase cursor-pointer"
            >
              <option value="">Select Practitioner</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} — {doc.specialty || 'General Practice'}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Select Consultation Date</label>
              <input
                type="date"
                value={bookingForm.date}
                onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                className="w-full bg-slate-950 text-white rounded-xl py-3.5 px-4 border border-white/[0.04] focus:border-indigo-500 outline-none font-semibold text-xs cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Select Session Time Slot</label>
              <select
                value={bookingForm.time}
                onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                className="w-full bg-slate-950 text-white rounded-xl py-3.5 px-4 border border-white/[0.04] focus:border-indigo-500 outline-none font-bold text-xs uppercase cursor-pointer"
              >
                <option value="">Select Time Slot</option>
                <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
                <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-5 border-t border-white/[0.04]">
            <Button variant="outline" onClick={handleCloseBookModal}>Cancel</Button>
            <Button variant="primary" onClick={handleBookAppointment}>Coordinate Schedule</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
