import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase';

type UserRole = 'admin' | 'manager' | 'employee';

export function useUserRole(userId: string | undefined) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        setRole(null);
      } else {
        setRole(data?.role || null);
      }
      setLoading(false);
    };

    fetchRole();
  }, [userId]);

  return { role, loading };
}
