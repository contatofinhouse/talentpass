import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const smoothScroll = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg h-14">
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-md">
            <Send className="h-6 w-6 text-white" fill="white" />
          </div>
          <span className="text-xl font-bold">TalentPass</span>
        </div>

        {/* Menu Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          <span
            onClick={() => smoothScroll("#categorias")}
            className="font-medium transition-colors hover:text-primary cursor-pointer"
          >
            Categorias
          </span>
          <span
            onClick={() => smoothScroll("#conteudo")}
            className="font-medium transition-colors hover:text-primary cursor-pointer"
          >
            Conteúdo
          </span>
          <span
            onClick={() => smoothScroll("#beneficios")}
            className="font-medium transition-colors hover:text-primary cursor-pointer"
          >
            Benefícios
          </span>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            className="text-sm px-3"
            onClick={() => navigate("/login")}
          >
            Entrar
          </Button>

          {/* CTA cheio ✅ */}
          <Button
            className="text-sm px-4 py-2 shadow-lg hover:brightness-110 transition-all"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate("/signup");
            }}
          >
            Começar grátis
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
