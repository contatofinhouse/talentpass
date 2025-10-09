import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-learning.jpg";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-primary/80 py-20 lg:py-32">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6bTAtOHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

      <div className="container relative mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <div className="h-2 w-2 animate-pulse rounded-full bg-accent"></div>
              Microlearning IA para sua equipe
            </div>

            <h1 className="text-5xl font-bold leading-tight text-white lg:text-6xl xl:text-7xl">
              Treinamento corporativo <span className="text-white drop-shadow-lg">que funciona.</span>
            </h1>

            <p className="text-lg text-white/90 lg:text-xl">
              Plataforma de educação continuada em soft e hard skills em áreas como comunicação, vendas, TI, marketing e
              suporte. Vídeos curtos, textos práticos e aprendizado que aprimoram sua equipe para o mercado.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button variant="hero" size="lg" className="group" onClick={() => navigate("/signup")}>
                Começar agora
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                onClick={() => navigate("/signup")}
              >
                <Play className="h-5 w-5" />
                Ver demonstração
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-white">5min</div>
                <div className="text-sm text-white/70">Por dia</div>
              </div>
              <div className="h-12 w-px bg-white/20"></div>
              <div>
                <div className="text-3xl font-bold text-white">100+</div>
                <div className="text-sm text-white/70">Conteúdos</div>
              </div>
              <div className="h-12 w-px bg-white/20"></div>
              <div>
                <div className="text-3xl font-bold text-white">5</div>
                <div className="text-sm text-white/70">Áreas-chave</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-accent-glow to-primary-glow opacity-20 blur-2xl"></div>
            <img
              src={heroImage}
              alt="Equipe aprendendo com microlearning"
              className="relative rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
