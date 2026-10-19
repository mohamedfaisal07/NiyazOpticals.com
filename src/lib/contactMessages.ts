import { supabase } from './supabase';
import type { Database } from './database.types';

export type ContactMessageInput = Pick<
  Database['public']['Tables']['contact_messages']['Insert'],
  'name' | 'phone' | 'email' | 'subject' | 'message'
>;

const clean = (value: string) => value.trim();

export const submitContactMessage = async (input: ContactMessageInput) => {
  const payload = {
    name: clean(input.name),
    phone: clean(input.phone),
    email: input.email ? clean(input.email) : null,
    subject: clean(input.subject),
    message: clean(input.message),
  };

  if (!payload.name || !payload.phone || !payload.subject || !payload.message) {
    throw new Error('Please fill all required contact fields.');
  }

  if (!supabase) {
    throw new Error('Supabase is not configured. Please check your environment variables.');
  }

  const { error } = await supabase
    .from('contact_messages')
    .insert(payload);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};
