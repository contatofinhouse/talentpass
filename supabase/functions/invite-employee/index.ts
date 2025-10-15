import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { email, name, manager_id } = await req.json();

    console.log("Enviando convite para:", email, "Manager:", manager_id);

    // Verificar se o manager tem status active
    const { data: managerProfile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("status")
      .eq("id", manager_id)
      .single();

    if (profileError || !managerProfile) {
      throw new Error("Manager não encontrado");
    }

    if (managerProfile.status !== "active") {
      throw new Error("Apenas managers com plano ativo podem adicionar colaboradores");
    }

    // Enviar convite usando Admin API
    const { data: inviteData, error: inviteError } = await supabaseClient.auth.admin.inviteUserByEmail(
      email,
      {
        data: {
          name: name,
          manager_id: manager_id,
        },
        redirectTo: `${Deno.env.get("SUPABASE_URL")}/auth/v1/verify`,
      }
    );

    if (inviteError) {
      console.error("Erro ao enviar convite:", inviteError);
      throw inviteError;
    }

    console.log("Convite enviado com sucesso:", inviteData);

    return new Response(
      JSON.stringify({ success: true, user: inviteData.user }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Erro na função invite-employee:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
