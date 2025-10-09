import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    name: "Teams",
    icon: "🟣",
    price: "R$ 49",
    period: "/mês",
    subtitle: "(até 50 colaboradores)",
    additional: "+ R$ 0,99 por colaborador adicional",
    description: "Microlearning corporativo para equipes que querem crescer juntas.",
    features: [
      "Mais de 100 aulas com vídeos, testes, mapas mentais e resumos",
      "Painel de acompanhamento da equipe",
      "Trilhas personalizadas por competência",
      "Relatórios de progresso mensais",
      "Suporte prioritário",
    ],
    idealFor: "pequenas e médias empresas, times de vendas, agências e startups",
    cta: "Começar agora",
    highlight: true,
  },
  {
    name: "Enterprise",
    icon: "⚫",
    price: "Sob consulta",
    period: "",
    description: "Treinamento corporativo em larga escala, com integração total.",
    features: [
      "Tudo do plano Teams",
      "Licenciamento para 300+ colaboradores",
      "Integração com base de conhecimento interna",
      "Exportação avançada de vídeos e trilhas em SCORM/xAPI",
      "Personalização de identidade visual e trilhas",
      "API para integração com LMS corporativo",
      "Suporte técnico dedicado e onboarding completo",
    ],
    idealFor: "grandes empresas e organizações com programas internos de desenvolvimento",
    cta: "Falar com especialista",
    highlight: false,
  },
];

const benefits = [
  "Teste gratuito de 14 dias (sem cartão)",
  "Novos conteúdos toda semana",
  "Aulas curtas. Abordagem direta e aplicável ao mercado",
  "Cancelamento a qualquer momento",
  "Treinamentos modernos, criados com IA generativa do Google sob orientação e revisão de especialistas de mercado",
];

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold lg:text-5xl">Planos e Preços</h2>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            Planos que se adaptam à sua rotina de aprendizado
          </p>
          <p className="mx-auto mt-2 max-w-3xl text-base text-muted-foreground">
            Escolha o plano ideal para a sua empresa. Acesso imediato, 14 dias para teste gratuito, sem fidelidade e
            evolução contínua.
          </p>
        </div>

        <div className="mb-12 grid gap-8 lg:grid-cols-2">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative flex flex-col ${
                plan.highlight ? "border-primary shadow-[0_8px_30px_0_hsl(var(--primary)/0.25)]" : ""
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1 text-sm font-semibold text-white shadow-lg">
                  Mais Popular
                </div>
              )}

              <CardHeader className="pb-8 pt-6">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-3xl">{plan.icon}</span>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                </div>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  {plan.subtitle && <p className="mt-1 text-sm text-muted-foreground">{plan.subtitle}</p>}
                  {plan.additional && <p className="mt-1 text-sm text-muted-foreground">{plan.additional}</p>}
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-lg bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold">Ideal para:</span> {plan.idealFor}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="pt-4">
                <Button
                  variant={plan.highlight ? "hero" : "default"}
                  size="lg"
                  className="w-full"
                  onClick={() => navigate("/signup")}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 p-8">
          <h3 className="mb-6 text-center text-xl font-bold">✨ Todos os planos incluem:</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
