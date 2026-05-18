import apiClient from './apiClient';

export const clinicService = {
  // --- Patients ---
  getPatients: async () => {
    const response = await apiClient.get('/patients');
    return response.data;
  },
  
  addPatient: async (patientData) => {
    const response = await apiClient.post('/patients/add', patientData);
    return response.data;
  },

  editPatient: async (id, patientData) => {
    const response = await apiClient.put(`/patients/edit/${id}`, patientData);
    return response.data;
  },

  getPatientHistory: async (patientId) => {
    const response = await apiClient.get(`/patients/history/${patientId}`);
    return response.data;
  },

  // --- Appointments ---
  getAllAppointments: async () => {
    const response = await apiClient.get('/appointments');
    return response.data;
  },

  bookAppointment: async (appointmentData) => {
    const response = await apiClient.post('/appointments/book', appointmentData);
    return response.data;
  },

  getDoctorSchedule: async () => {
    const response = await apiClient.get('/appointments/doctor-schedule');
    return response.data;
  },

  updateAppointmentStatus: async (id, status) => {
    const response = await apiClient.patch(`/appointments/status/${id}`, { status });
    return response.data;
  },

  cancelAppointment: async (id) => {
    const response = await apiClient.put(`/appointments/cancel/${id}`);
    return response.data;
  },

  // --- Prescriptions ---
  addPrescription: async (prescriptionData) => {
    const response = await apiClient.post('/prescriptions/add', prescriptionData);
    return response.data;
  },

  getPatientPrescriptions: async (patientId) => {
    const response = await apiClient.get(`/prescriptions/patient/${patientId}`);
    return response.data;
  },

  downloadPrescriptionPDF: async (id) => {
    const response = await apiClient.get(`/prescriptions/download/${id}`, {
      responseType: 'blob', // Important for PDF files
    });
    return response.data;
  },

  // --- Diagnosis / History ---
  addDiagnosis: async (diagnosisData) => {
    const response = await apiClient.post('/diagnosis/add', diagnosisData);
    return response.data;
  },

  getDiagnosisHistory: async (patientId) => {
    const response = await apiClient.get(`/diagnosis/patient/${patientId}`);
    return response.data;
  },

  // --- Admin ---
  getAdminDoctors: async () => {
    const response = await apiClient.get('/admin/doctors');
    return response.data;
  },

  getAdminDashboard: async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  },
};
