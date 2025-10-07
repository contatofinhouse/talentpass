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

    let isMounted = true;

    const fetchRole = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (isMounted) {
        if (error) {
          console.error('Error fetching user role:', error);
          setRole(null);
        } else {
          setRole(data?.role || null);
        }
        setLoading(false);
      }
    };

    fetchRole();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return { role, loading };
}
