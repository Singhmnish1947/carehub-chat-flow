
import { useSupabaseOperations } from './use-supabase-operations';
import { Database } from '@/integrations/supabase/types';

type Doctor = Database['public']['Tables']['doctors']['Row'];

export const useDoctors = (options?: {
  filter?: Partial<Doctor>;
  orderBy?: { column: keyof Doctor; ascending?: boolean };
}) => {
  return useSupabaseOperations<Doctor>('doctors', options);
};
