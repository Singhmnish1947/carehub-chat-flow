
import { useSupabaseOperations } from './use-supabase-operations';
import { Database } from '@/integrations/supabase/types';

type Patient = Database['public']['Tables']['patients']['Row'];

export const usePatients = (options?: {
  filter?: Partial<Patient>;
  orderBy?: { column: keyof Patient; ascending?: boolean };
}) => {
  return useSupabaseOperations<Patient>('patients', options);
};
