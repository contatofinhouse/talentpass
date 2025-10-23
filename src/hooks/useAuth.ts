/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { User, Session,  } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase";
import { useToast } from "@/hooks/use-toast";
import type { UserAttributes } from "@supabase/supabase-js";


interface SignUpData {
  name: string;
  company_name: string;
  cnpj?: string;
  phone: string;
  employee_count?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: SignUpData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/welcome`,
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          return { error: "E-mail já cadastrado" };
        }
        if (error.message.includes("Password")) {
          return { error: "Senha deve ter no mínimo 6 caracteres" };
        }
        return { error: error.message };
      }

      return { data, error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid")) {
          return { error: "E-mail ou senha incorretos" };
        }
        return { error: error.message };
      }

      return { data, error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

const updateUser = async (data: UserAttributes) => {
  try {
    const { error } = await supabase.auth.updateUser(data);
    if (error) return { error: error.message };
    return { error: null };
  } catch (err: any) {
    return { error: err.message };
  }
};


  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateUser
  };
};
