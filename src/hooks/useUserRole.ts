import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase';

type UserRole = 'admin' | 'manager' | 'employee';

export function useUserRole(userId: string | undefined) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (!userId) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      console.log('Fetching role for user:', userId);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      console.log('Role fetch result:', { data, error });

      if (isMounted) {
        if (error) {
          console.error('Error fetching user role:', error);
          setRole(null);
        } else {
          console.log('Setting role to:', data?.role || null);
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
