import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase";
import { useToast } from "@/hooks/use-toast";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SelectAreaRole({ user, profile, onUpdated }: any) {
  const { toast } = useToast();
  const [selected, setSelected] = useState(profile.area_role ?? "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!selected) {
      return toast({
        title: "Atenção",
        description: "Selecione uma área",
        variant: "destructive",
      });
    }

    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ area_role: selected })
      .eq("id", user?.id);

    setLoading(false);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }

    toast({
      title: "Perfil atualizado!",
      description: "Vamos recomendar os cursos certos pra você 😄",
    });

    onUpdated(selected); // ✅ atualiza sem reload
  };

  if (profile.area_role) return null;

  return (
    <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div>
        <h3 className="font-semibold text-primary">Personalize seu aprendizado ✨</h3>
        <p className="text-sm text-muted-foreground">
          Escolha sua área de atuação na empresa.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <select
          className="border rounded-lg px-3 py-2 text-sm bg-background"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
         <option value="">Selecione...</option>
  <option value="Liderança e Gestão de Pessoas">Liderança e Gestão de Pessoas</option>
  <option value="Recursos Humanos">Recursos Humanos</option>
  <option value="Comercial e Vendas">Comercial e Vendas</option>
  <option value="Marketing">Marketing</option>
  <option value="Compras e Suprimentos">Compras e Suprimentos</option>
  <option value="Operações e Suporte">Operações e Suporte</option>
  <option value="Tecnologia">Tecnologia</option>
        </select>

        <Button size="sm" onClick={handleSave} disabled={loading}>
          Salvar
        </Button>
      </div>
    </div>
  );
}
