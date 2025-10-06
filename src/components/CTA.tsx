import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-accent p-12 text-center lg:p-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6bTAtOHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
          
          <div className="relative mx-auto max-w-3xl space-y-8">
            <h2 className="text-4xl font-bold text-white lg:text-5xl">
              Transforme sua equipe com microlearning
            </h2>
            <p className="text-xl text-white/90">
              Comece hoje e veja resultados em semanas, não meses. Conteúdo diário que desenvolve competências de verdade.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button variant="hero" size="lg" className="group bg-white text-primary hover:bg-white/90">
                Experimente gratuitamente
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              >
                Falar com especialista
              </Button>
            </div>
            <p className="text-sm text-white/70">
              Sem cartão de crédito • Acesso completo por 14 dias • Cancele quando quiser
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;