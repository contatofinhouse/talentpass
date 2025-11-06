import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import ContentShowcase from "@/components/ContentShowcase";
import Benefits from "@/components/Benefits";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";

const Index = () => {
  // Lógica para esconder banner após scroll
  React.useEffect(() => {
    const handleScroll = () => {
      const banner = document.getElementById("open2work-banner");
      if (banner) {
        if (window.scrollY > 300) {
          banner.style.transform = "translateY(-100%)";
        } else {
          banner.style.transform = "translateY(0)";
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Banner Open2Work com scroll logic */}
      <div
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-3 text-sm sticky top-0 z-[60] shadow-md transition-transform duration-300"
        id="open2work-banner"
      >
        <div className="container mx-auto px-4 flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-block bg-white/20 px-2 py-0.5 rounded text-xs font-semibold">80% OFF</span>
          <span>
            👩‍💼 Está <strong>Open to Work</strong>?
          </span>
          <span>
            Acesse o TalentPass por apenas <strong>R$ 9,80/mês</strong>
          </span>
        </div>
      </div>
      <Navbar />
      <Hero />
      <div id="categorias">
        <Categories />
      </div>
      <div id="conteudo">
        <ContentShowcase />
      </div>
      <div id="beneficios">
        <Benefits />
      </div>
      <div id="planos">
        <Pricing />
      </div>

      {/* Seção de Depoimentos */}
      <div id="depoimentos">
        <Testimonials />
      </div>

      {/* Bloco Talent Partner */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
              💼 Programa de Parceiros
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Torne-se um{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Talent Partner
              </span>
            </h2>

            <p className="text-lg text-muted-foreground mb-3">
              Indique empresas para o TalentPass e receba{" "}
              <strong className="text-indigo-600">40% de comissão recorrente</strong> sobre tudo o que elas investirem
              enquanto forem clientes ativos.
            </p>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-indigo-100 mb-6 max-w-xl mx-auto">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-indigo-600">40%</div>
                  <div className="text-xs text-muted-foreground">Comissão recorrente</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-600">♾️</div>
                  <div className="text-xs text-muted-foreground">Ganhos vitalícios</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-600">🤝</div>
                  <div className="text-xs text-muted-foreground">Sem exclusividade</div>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Ideal para consultores de RH, coaches, profissionais de vendas e qualquer pessoa que tenha relacionamento
              com empresas.
            </p>

            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
              onClick={() =>
                window.open(
                  "https://wa.me/5511955842951?text=Olá!%20Quero%20participar%20do%20programa%20Talent%20Partner%20e%20indicar%20empresas%20para%20o%20TalentPass.",
                  "_blank",
                )
              }
            >
              Quero participar 🚀
            </Button>
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
