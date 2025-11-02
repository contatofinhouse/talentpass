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
    subtitle: "(até 40 colaboradores)",
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
      "Integração com base de conhecimento interna do cliente",
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

        {/* Plano especial Open2Work */}
        <Card className="relative mb-8 max-w-2xl mx-auto border-2 border-dashed border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white shadow-lg">
            🎯 Promoção Especial
          </div>
          
          <CardHeader className="pb-6 pt-8 text-center">
            <div className="mb-2 flex items-center justify-center gap-2">
              <span className="text-3xl">👩‍💼</span>
              <CardTitle className="text-2xl">Open2Work</CardTitle>
            </div>
            <CardDescription className="text-base">
              Para quem está buscando recolocação profissional
            </CardDescription>
            <div className="mt-4">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl text-muted-foreground line-through">R$ 49</span>
                <span className="text-4xl font-bold text-indigo-600">R$ 9,80</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-indigo-600">80% de desconto enquanto durar a promoção</p>
            </div>
          </CardHeader>

          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                <span>Acesso completo a todas as trilhas de aprendizado</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                <span>Certificados para enriquecer seu currículo</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                <span>Foco em soft skills e hard skills valorizadas pelo mercado</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                <span>Sem fidelidade - cancele quando quiser</span>
              </li>
            </ul>
            
            <div className="mt-4 rounded-lg bg-white/60 p-3 border border-indigo-200">
              <p className="text-xs text-muted-foreground text-center">
                💡 <span className="font-semibold">Dica:</span> Adicione os certificados do TalentPass ao seu LinkedIn para aumentar sua visibilidade com recrutadores
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              variant="hero"
              size="lg"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
              onClick={() => navigate("/signup")}
            >
              Quero aproveitar 🚀
            </Button>
          </CardFooter>
        </Card>

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
