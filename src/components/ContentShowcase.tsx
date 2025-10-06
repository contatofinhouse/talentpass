import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, FileText } from "lucide-react";

const contentItems = [
  {
    type: "video",
    title: "Técnicas de Escuta Ativa",
    category: "Comunicação",
    duration: "3 min",
    thumbnail: "bg-gradient-to-br from-blue-400 to-blue-600",
  },
  {
    type: "text",
    title: "Método SPIN Selling",
    category: "Vendas",
    duration: "5 min",
    thumbnail: "bg-gradient-to-br from-green-400 to-green-600",
  },
  {
    type: "video",
    title: "Git Flow Simplificado",
    category: "TI",
    duration: "4 min",
    thumbnail: "bg-gradient-to-br from-purple-400 to-purple-600",
  },
  {
    type: "text",
    title: "SEO para Iniciantes",
    category: "Marketing",
    duration: "6 min",
    thumbnail: "bg-gradient-to-br from-orange-400 to-orange-600",
  },
  {
    type: "video",
    title: "Gestão de Conflitos",
    category: "Suporte",
    duration: "4 min",
    thumbnail: "bg-gradient-to-br from-indigo-400 to-indigo-600",
  },
  {
    type: "text",
    title: "Feedback Construtivo",
    category: "Comunicação",
    duration: "3 min",
    thumbnail: "bg-gradient-to-br from-cyan-400 to-cyan-600",
  },
];

const ContentShowcase = () => {
  return (
    <section className="bg-secondary/30 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold lg:text-5xl">
            Conteúdo que se encaixa na sua rotina
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
              <div className={`relative flex h-48 items-center justify-center ${item.thumbnail}`}>
                <div className="absolute inset-0 bg-black/20"></div>
                {item.type === "video" ? (
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
                    <Play className="h-8 w-8 text-primary" fill="currentColor" />
                  </div>
                ) : (
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
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