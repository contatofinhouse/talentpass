import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-learning.jpg";
import { useNavigate } from "react-router-dom";

const heroAvatars = [
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=96&h=96&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&h=96&q=80",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=96&h=96&q=80",
  "https://images.unsplash.com/photo-1500336624523-d727130c3328?auto=format&fit=crop&w=96&h=96&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=96&h=96&q=80",
];

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent py-20 lg:py-32">
      {/* Geometric hexagonal pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTAgMEwyNSAxNC40MzM4VjQzLjMwMTNMNTAgNTcuNzM1MUw3NSA0My4zMDEzVjE0LjQzMzhMNTAgMFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] bg-repeat"></div>
      </div>
      
      {/* Diagonal grid lines with 3D perspective */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.1) 49%, rgba(255,255,255,0.1) 51%, transparent 52%), 
                           linear-gradient(-45deg, transparent 48%, rgba(255,255,255,0.1) 49%, rgba(255,255,255,0.1) 51%, transparent 52%)`,
          backgroundSize: '60px 60px',
          transform: 'perspective(1000px) rotateX(60deg)',
          transformOrigin: 'center bottom'
        }}></div>
      </div>

      {/* Accent geometric shapes */}
      <div className="absolute right-0 top-0 h-96 w-96 opacity-30">
        <div className="h-full w-full bg-gradient-to-br from-accent-glow/40 to-transparent" style={{
          clipPath: 'polygon(100% 0, 100% 50%, 50% 100%, 0 50%)'
        }}></div>
      </div>
      <div className="absolute bottom-0 left-0 h-80 w-80 opacity-20">
        <div className="h-full w-full bg-gradient-to-tr from-primary-glow/40 to-transparent" style={{
          clipPath: 'polygon(0 100%, 50% 0, 100% 50%, 50% 100%)'
        }}></div>
      </div>

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
              <Button
                variant="hero"
                size="lg"
                className="group inline-flex items-center gap-2"
                onClick={() => navigate("/signup")}
              >
                <span className="font-semibold">Começar agora</span>
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

            <div className="flex flex-wrap items-center gap-3 text-sm text-white">
              <div className="flex items-center -space-x-2">
                {heroAvatars.map((url, idx) => (
                  <Avatar key={url} className="h-8 w-8 border border-white/80 shadow-sm">
                    <AvatarImage src={url} alt={`Pessoa ${idx + 1}`} />
                    <AvatarFallback className="bg-slate-200 text-xs font-semibold text-slate-700">TP</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span>Junte-se a centenas de empresas que já oferecem o benefício aos seus colaboradores.</span>
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
