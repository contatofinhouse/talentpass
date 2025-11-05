/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, BookOpen, Users, LogOut } from "lucide-react";

interface ManagerHeaderProps {
  profile: any;
  onNavigate: (view: "courses" | "profile" | "employees") => void;
  onLogout: () => void;
  isEmployee?: boolean;
  isOpen2Work?: boolean;
}

export const ManagerHeader = ({
  profile,
  onNavigate,
  onLogout,
  isEmployee = false,
  isOpen2Work = false,
}: ManagerHeaderProps) => {
  const handleManagePlan = () => {
    const isActive = profile?.status === "active";
    
    const message = isActive
      ? "Olá! Gostaria de gerenciar meu Plano Teams na plataforma de educação com IA. \nPreciso de ajuda para ajustar colaboradores, fazer upgrade ou tirar dúvidas sobre meu plano atual."
      : "Olá! Quero ativar o plano Teams na plataforma de educação com IA. \nVi que o Plano Teams é R$49/mês até 40 funcionários e R$0,99 por funcionário adicional. \nGostaria de incluir minha equipe e garantir acesso imediato.";
    
    window.open(`https://wa.me/5511955842951?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div>
          <h1 className="text-xl font-bold">TalentPass</h1>
          <p className="text-sm text-muted-foreground">
            {isEmployee ? "Painel do Colaborador" : "Painel do Gestor"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <User className="mr-2 h-4 w-4" />
                Minha Conta
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{profile?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {profile?.company_name}
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => onNavigate("courses")}>
                <BookOpen className="mr-2 h-4 w-4" />
                Cursos
              </DropdownMenuItem>

            {/* Exibe "Minha Conta" (sempre), muda o texto conforme o papel */}
<DropdownMenuItem onClick={() => onNavigate("profile")}>
  <Settings className="mr-2 h-4 w-4" />
  {isEmployee ? "Meu Perfil" : "Cadastro"}
</DropdownMenuItem>

              {/* Exibe "Colaboradores" apenas se for manager */}
              {!isEmployee && (
                <DropdownMenuItem onClick={() => onNavigate("employees")}>
                  <Users className="mr-2 h-4 w-4" />
                  Colaboradores
                </DropdownMenuItem>
              )}

              {/* Exibe "Gerenciar Plano" se for manager ou open2work */}
              {(!isEmployee || isOpen2Work) && (
                <DropdownMenuItem onClick={handleManagePlan}>
                  <Users className="mr-2 h-4 w-4" />
                  {profile?.status === "active" ? "Gerenciar Plano" : "Ativar Plano"}
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
