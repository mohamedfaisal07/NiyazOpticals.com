import type { Json } from './json.types';

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          role: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          role?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          full_name?: string;
          email?: string;
          phone?: string | null;
          role?: string;
          is_active?: boolean;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          subject: string;
          message: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email?: string | null;
          subject: string;
          message: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          phone?: string;
          email?: string | null;
          subject?: string;
          message?: string;
          status?: string;
        };
        Relationships: [];
      };
      appointments: {
        Row: {
          id: string;
          customer_name: string;
          phone: string;
          appointment_type: 'Store Visit' | 'Home Eye Test';
          interest: string;
          message: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          phone: string;
          appointment_type: 'Store Visit' | 'Home Eye Test';
          interest: string;
          message?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          customer_name?: string;
          phone?: string;
          appointment_type?: 'Store Visit' | 'Home Eye Test';
          interest?: string;
          message?: string | null;
          status?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          email: string | null;
          phone: string;
          address: string;
          items: Json;
          total: number | string;
          status: string;
          payment_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          customer_name: string;
          email?: string | null;
          phone: string;
          address: string;
          items?: Json;
          total: number;
          status?: string;
          payment_id?: string | null;
          created_at?: string;
        };
        Update: {
          customer_name?: string;
          email?: string | null;
          phone?: string;
          address?: string;
          items?: Json;
          total?: number;
          status?: string;
          payment_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
