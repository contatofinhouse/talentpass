import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LegalPageLayoutProps {
  children: ReactNode;
  title: string;
  lastUpdated?: string;
}

const LegalPageLayout = ({ children, title, lastUpdated }: LegalPageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <Send className="h-6 w-6 text-white" fill="white" />
              </div>
              <span className="text-xl font-bold">TalentPass</span>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold">{title}</h1>
            {lastUpdated && (
              <p className="text-sm text-muted-foreground">
                Última atualização: {lastUpdated}
              </p>
            )}
          </div>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {children}
          </div>
        </div>
      </main>

      <footer className="border-t bg-secondary/30 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 TalentPass. Todos os direitos reservados.</p>
          <p className="mt-2">CNPJ: 60.806.192/0001-50</p>
        </div>
      </footer>
    </div>
  );
};

export default LegalPageLayout;
