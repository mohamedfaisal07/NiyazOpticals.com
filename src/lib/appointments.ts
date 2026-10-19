import { supabase } from './supabase';
import type { Appointment } from '../types';
import type { Database } from './database.types';

export type AppointmentInput = Pick<
  Database['public']['Tables']['appointments']['Insert'],
  'customer_name' | 'phone' | 'appointment_type' | 'interest' | 'message'
>;

const clean = (value: string) => value.trim();

export const fromAppointmentRow = (row: Database['public']['Tables']['appointments']['Row']): Appointment => ({
  id: row.id,
  name: row.customer_name,
  phone: row.phone,
  date: row.created_at.split('T')[0],
  slot: 'To be confirmed',
  type: row.appointment_type,
  interestedIn: row.interest,
  message: row.message || '',
  status: row.status as Appointment['status'],
});

export const submitAppointment = async (input: AppointmentInput) => {
  const payload = {
    customer_name: clean(input.customer_name),
    phone: clean(input.phone),
    appointment_type: input.appointment_type,
    interest: clean(input.interest),
    message: input.message ? clean(input.message) : null,
    status: 'Pending',
  };

  if (!payload.customer_name || !payload.phone || !payload.appointment_type || !payload.interest) {
    throw new Error('Please fill all required appointment fields.');
  }

  if (!supabase) {
    throw new Error('Supabase is not configured. Please check your environment variables.');
  }

  const { error } = await supabase
    .from('appointments')
    .insert(payload);

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: crypto.randomUUID(),
    name: payload.customer_name,
    phone: payload.phone,
    date: new Date().toISOString().split('T')[0],
    slot: 'To be confirmed',
    type: payload.appointment_type,
    interestedIn: payload.interest,
    message: payload.message || '',
    status: 'Pending',
  } satisfies Appointment;
};

export const getAdminAppointments = async (adminToken: string) => {
  const response = await fetch('/api/appointments', {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || 'Unable to load appointments.');
  }

  return (data.appointments || []) as Appointment[];
};

export const updateAdminAppointmentStatus = async (
  adminToken: string,
  appointmentId: string,
  status: Appointment['status'],
) => {
  const response = await fetch(`/api/appointments/${encodeURIComponent(appointmentId)}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || 'Unable to update appointment status.');
  }

  return data.appointment as Appointment;
};

export const deleteAdminAppointment = async (adminToken: string, appointmentId: string) => {
  const response = await fetch(`/api/appointments/${encodeURIComponent(appointmentId)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || 'Unable to delete appointment.');
  }

  return true;
};
