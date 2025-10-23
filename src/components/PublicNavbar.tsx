import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export const PublicNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Send className="h-6 w-6 text-white" fill="white" />
          </div>
          <span className="text-xl font-bold">TalentPass</span>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate("/login")}>
            Entrar
          </Button>
          <Button onClick={() => navigate("/signup")}>
            Criar Conta Grátis
          </Button>
        </div>
      </div>
    </nav>
  );
};
