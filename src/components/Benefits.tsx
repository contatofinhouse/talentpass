import { Zap, Target, TrendingUp, Users } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Aprendizado Rápido",
    description: "Conteúdo otimizado para absorção em minutos, não horas",
  },
  {
    icon: Target,
    title: "Foco no Essencial",
    description: "Apenas o que realmente importa, sem floreios ou teoria desnecessária",
  },
  {
    icon: TrendingUp,
    title: "Evolução Contínua",
    description: "Drops diários que constroem competências sólidas ao longo do tempo",
  },
  {
    icon: Users,
    title: "Para Toda Equipe",
    description: "Conteúdo relevante para diferentes áreas e níveis de experiência",
  },
];

const Benefits = () => {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold lg:text-5xl">
            Por que microlearning?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Uma abordagem moderna de aprendizado que respeita seu tempo e maximiza resultados
          </p>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group text-center transition-transform hover:scale-105"
              >
                <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-[0_8px_20px_0_hsl(var(--primary)/0.25)] transition-all group-hover:shadow-[0_12px_28px_0_hsl(var(--primary)/0.35)]">
                  <Icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;