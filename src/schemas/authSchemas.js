import { z as zodClient } from 'zod';

export const loginSchema = zodClient.object({
  email: zodClient.string().min(1, 'Email is required').email('Invalid email address'),
  password: zodClient.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = zodClient.object({
  name: zodClient.string().min(3, 'Name must be at least 3 characters'),
  email: zodClient.string().min(1, 'Email is required').email('Invalid email address'),
  password: zodClient.string().min(6, 'Password must be at least 6 characters'),
  role: zodClient.enum(['Admin', 'Doctor', 'Receptionist', 'Patient']).default('Patient'),
});