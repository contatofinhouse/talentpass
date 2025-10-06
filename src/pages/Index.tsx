import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import ContentShowcase from "@/components/ContentShowcase";
import Benefits from "@/components/Benefits";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
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
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;