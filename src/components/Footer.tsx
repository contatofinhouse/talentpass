import { GraduationCap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">MicroLearn</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Educação corporativa que se encaixa na sua rotina.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 font-semibold">Produto</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Funcionalidades</a></li>
              <li><a href="#" className="hover:text-foreground">Preços</a></li>
              <li><a href="#" className="hover:text-foreground">Casos de uso</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 font-semibold">Empresa</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Sobre nós</a></li>
              <li><a href="#" className="hover:text-foreground">Blog</a></li>
              <li><a href="#" className="hover:text-foreground">Carreiras</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 font-semibold">Suporte</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Central de ajuda</a></li>
              <li><a href="#" className="hover:text-foreground">Contato</a></li>
              <li><a href="#" className="hover:text-foreground">Status</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 MicroLearn. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;