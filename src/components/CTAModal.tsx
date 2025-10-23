import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface CTAModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CTAModal = ({ open, onOpenChange }: CTAModalProps) => {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            🎓 Continue Assistindo Gratuitamente!
          </DialogTitle>
          <DialogDescription className="text-base">
            Crie sua conta grátis para acessar este e centenas de outros cursos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>Acesso ilimitado a todos os cursos</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>Certificados de conclusão</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>Aprenda no seu próprio ritmo</span>
            </li>
          </ul>

          <Button
            onClick={() => navigate("/signup")}
            className="w-full"
            size="lg"
          >
            Cadastrar Gratuitamente
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/login")}
            className="w-full"
          >
            Já tenho conta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
