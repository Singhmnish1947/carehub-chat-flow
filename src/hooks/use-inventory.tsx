
import { useSupabaseOperations } from './use-supabase-operations';
import { Database } from '@/integrations/supabase/types';

type InventoryItem = Database['public']['Tables']['inventory_items']['Row'];

export const useInventory = (options?: {
  filter?: Partial<InventoryItem>;
  orderBy?: { column: keyof InventoryItem; ascending?: boolean };
}) => {
  return useSupabaseOperations<InventoryItem>('inventory_items', options);
};
