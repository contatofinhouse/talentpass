import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, FileText } from "lucide-react";
import spinSellingImg from "@/assets/content-spin-selling.jpg";
import seoImg from "@/assets/content-seo.jpg";
import escutaAtivaImg from "@/assets/content-escuta-ativa.jpg";
import feedbackImg from "@/assets/content-feedback.jpg";
import gitFlowImg from "@/assets/content-git-flow.jpg";
import conflitosImg from "@/assets/content-conflitos.jpg";

const contentItems = [
  {
    type: "text",
    title: "Método SPIN Selling",
    category: "Vendas e Marketing",
    duration: "5 min",
    image: spinSellingImg,
  },
  {
    type: "text",
    title: "SEO para Iniciantes",
    category: "Vendas e Marketing",
    duration: "6 min",
    image: seoImg,
  },
  {
    type: "text",
    title: "Prompts Eficazes para ChatGPT",
    category: "Automação com IA",
    duration: "4 min",
    image: gitFlowImg,
  },
  {
    type: "video",
    title: "Automação no Make.com",
    category: "Automação com IA",
    duration: "5 min",
    image: conflitosImg,
  },
  {
    type: "video",
    title: "Técnicas de Escuta Ativa",
    category: "Gestão, Liderança e Comunicação",
    duration: "3 min",
    image: escutaAtivaImg,
  },
  {
    type: "text",
    title: "Feedback Construtivo",
    category: "Gestão, Liderança e Comunicação",
    duration: "3 min",
    image: feedbackImg,
  },
];

const ContentShowcase = () => {
  return (
    <section className="bg-secondary/30 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold lg:text-5xl">
            Treinamento corporativo que cabe na rotina e transforma a performance da sua equipe
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Vídeos curtos e textos práticos criados para absorção rápida e aplicação imediata
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {contentItems.map((item, index) => (
            <Card
              key={index}
              className="group cursor-pointer overflow-hidden border-2 transition-all hover:scale-105 hover:shadow-[0_20px_50px_-10px_hsl(var(--primary)/0.2)]"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                {item.type === "video" ? (
                  <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
                    <Play className="h-8 w-8 text-primary" fill="currentColor" />
                  </div>
                ) : (
                  <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <Badge variant="secondary" className="font-semibold">
                    {item.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{item.duration}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold">{item.title}</h3>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContentShowcase;
