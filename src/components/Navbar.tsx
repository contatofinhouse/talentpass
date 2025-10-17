import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Send className="h-6 w-6 text-white" fill="white" />
          </div>
          <span className="text-xl font-bold">TalentPass</span>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#categorias" className="font-medium transition-colors hover:text-primary">
            Categorias
          </a>
          <a href="#conteudo" className="font-medium transition-colors hover:text-primary">
            Conteúdo
          </a>
          <a href="#beneficios" className="font-medium transition-colors hover:text-primary">
            Benefícios
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/login")}>
            Entrar
          </Button>
          <Button onClick={() => navigate("/signup")}>Começar grátis</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
