
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

// Define type for valid table names from the Supabase schema
type TableName = keyof Database['public']['Tables'];

export const useSupabaseOperations = <T extends unknown>(
  table: TableName,
  options?: {
    defaultData?: T[];
    filter?: object;
    orderBy?: { column: string; ascending?: boolean };
  }
) => {
  const [data, setData] = useState<T[]>(options?.defaultData || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      let query = supabase.from(table).select('*');

      // Apply filters if provided
      if (options?.filter) {
        query = query.match(options.filter);
      }

      // Apply ordering if provided
      if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? true,
        });
      }

      const { data: fetchedData, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setData(fetchedData as T[]);
    } catch (err) {
      console.error(`Error fetching ${table}:`, err);
      setError(err as Error);
      toast({
        title: 'Error',
        description: `Failed to fetch ${table}. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Create item
  const createItem = async (newItem: Partial<T>) => {
    try {
      const { data: createdItem, error: createError } = await supabase
        .from(table)
        .insert([newItem])
        .select()
        .single();

      if (createError) throw createError;

      setData(prev => [...prev, createdItem as T]);
      toast({
        title: 'Success',
        description: `${table} item created successfully.`,
      });

      return createdItem;
    } catch (err) {
      console.error(`Error creating ${table}:`, err);
      toast({
        title: 'Error',
        description: `Failed to create ${table} item. Please try again.`,
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Update item
  const updateItem = async (id: string, updates: Partial<T>) => {
    try {
      const { data: updatedItem, error: updateError } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setData(prev => 
        prev.map(item => 
          (item as any).id === id ? updatedItem as T : item
        )
      );

      toast({
        title: 'Success',
        description: `${table} item updated successfully.`,
      });

      return updatedItem;
    } catch (err) {
      console.error(`Error updating ${table}:`, err);
      toast({
        title: 'Error',
        description: `Failed to update ${table} item. Please try again.`,
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Delete item
  const deleteItem = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setData(prev => prev.filter(item => (item as any).id !== id));
      toast({
        title: 'Success',
        description: `${table} item deleted successfully.`,
      });
    } catch (err) {
      console.error(`Error deleting ${table}:`, err);
      toast({
        title: 'Error',
        description: `Failed to delete ${table} item. Please try again.`,
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  return {
    data,
    loading,
    error,
    fetchData,
    createItem,
    updateItem,
    deleteItem,
  };
};
