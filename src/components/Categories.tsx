import { TrendingUp, Sparkles, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

const categories = [
  {
    icon: TrendingUp,
    title: "Vendas e Marketing",
    description: "Técnicas modernas de vendas, SEO e estratégias de marketing digital",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Sparkles,
    title: "Automação com IA",
    description: "Ferramentas de IA para automatizar processos e aumentar produtividade",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Users,
    title: "Gestão, Liderança e Comunicação",
    description: "Desenvolva habilidades de gestão, liderança e comunicação efetiva",
    color: "from-blue-500 to-cyan-500",
  },
];

const Categories = () => {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold lg:text-5xl">
            Áreas de conhecimento
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Conteúdo especializado para desenvolver as competências mais importantes do mercado
          </p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card
                key={index}
                className="group cursor-pointer overflow-hidden border-2 bg-gradient-to-br from-card to-secondary p-6 transition-all hover:scale-105 hover:shadow-[0_20px_50px_-10px_hsl(var(--primary)/0.2)]"
              >
                <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} text-white shadow-lg transition-transform group-hover:scale-110`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{category.title}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;