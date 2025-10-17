import LegalPageLayout from "@/components/LegalPageLayout";
import { Book, Target, TrendingUp, Users, Zap, CheckCircle, Clock, BarChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CorporateEducationGuide = () => {
  return (
    <LegalPageLayout title="Guia Completo: Como Escolher uma Plataforma de Educação Corporativa">
      <section className="mb-12">
        <p className="mb-6 text-lg text-muted-foreground">
          A educação corporativa moderna exige soluções que acompanhem o ritmo acelerado dos negócios.
          Este guia ajudará você a tomar a decisão certa para sua empresa.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold">Por Que Investir em Educação Corporativa?</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <TrendingUp className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Aumento de Produtividade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Equipes bem treinadas são até 50% mais produtivas, segundo estudos da Harvard Business
                Review. O conhecimento aplicado gera resultados mensuráveis.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Retenção de Talentos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                94% dos colaboradores afirmam que permaneceriam mais tempo em empresas que investem em
                seu desenvolvimento profissional.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Target className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Alinhamento Estratégico</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Treinamentos direcionados garantem que toda a equipe esteja alinhada com os objetivos
                e valores da empresa.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>ROI Comprovado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Empresas que investem em treinamento têm 24% mais margem de lucro em comparação com
                aquelas que gastam menos em desenvolvimento.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold">Microlearning vs Treinamentos Tradicionais</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left font-semibold">Característica</th>
                <th className="p-4 text-left font-semibold">Microlearning</th>
                <th className="p-4 text-left font-semibold">Treinamento Tradicional</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4">Duração</td>
                <td className="p-4 text-primary">3-10 minutos por módulo</td>
                <td className="p-4">Horas ou dias inteiros</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Retenção de Informação</td>
                <td className="p-4 text-primary">Até 80% maior</td>
                <td className="p-4">Baixa (20-30%)</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Custo</td>
                <td className="p-4 text-primary">Até 50% menor</td>
                <td className="p-4">Alto (logística, material, tempo)</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Flexibilidade</td>
                <td className="p-4 text-primary">Total - qualquer hora/lugar</td>
                <td className="p-4">Limitada - horários fixos</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Engajamento</td>
                <td className="p-4 text-primary">Alto - conteúdo dinâmico</td>
                <td className="p-4">Baixo - fadiga e distração</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold">Critérios Essenciais para Escolher uma Plataforma</h2>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Book className="mb-2 h-6 w-6 text-primary" />
              <CardTitle>1. Qualidade e Relevância do Conteúdo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">O conteúdo deve ser:</p>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Atualizado constantemente com tendências de mercado</li>
                <li>Desenvolvido por especialistas da área</li>
                <li>Aplicável ao dia a dia dos colaboradores</li>
                <li>Disponível em português e adaptado à realidade brasileira</li>
                <li>Validado por humanos (não apenas gerado por IA)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="mb-2 h-6 w-6 text-primary" />
              <CardTitle>2. Experiência do Usuário (UX)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">A plataforma deve oferecer:</p>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Interface intuitiva e moderna</li>
                <li>Navegação simples, sem necessidade de treinamento extenso</li>
                <li>Acesso mobile para aprendizado em movimento</li>
                <li>Tempo de carregamento rápido</li>
                <li>Design responsivo para todos os dispositivos</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart className="mb-2 h-6 w-6 text-primary" />
              <CardTitle>3. Analytics e Relatórios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">Recursos de análise incluem:</p>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Dashboard com métricas de progresso individual e por equipe</li>
                <li>Relatórios de engajamento e conclusão de cursos</li>
                <li>Identificação de gaps de conhecimento</li>
                <li>Exportação de dados para análises externas</li>
                <li>Insights acionáveis para gestores</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="mb-2 h-6 w-6 text-primary" />
              <CardTitle>4. Implementação e Onboarding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">Considere:</p>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Tempo de setup: quanto mais rápido, melhor</li>
                <li>Facilidade de convite e cadastro de colaboradores</li>
                <li>Suporte durante a implementação</li>
                <li>Materiais de onboarding para gestores e colaboradores</li>
                <li>Período de teste ou demonstração gratuita</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold">Checklist de Avaliação</h2>
        <Card>
          <CardHeader>
            <CardTitle>Use este checklist ao avaliar plataformas</CardTitle>
            <CardDescription>
              Marque os itens que são importantes para sua organização
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                <span>Conteúdo relevante para seu setor de atuação</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                <span>Preço transparente e escalável com o crescimento da empresa</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                <span>Suporte em português e com respostas rápidas</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                <span>Dashboard de analytics robusto para gestores</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                <span>Conteúdo atualizado frequentemente (mensal ou quinzenal)</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                <span>Formato de microlearning (módulos curtos e focados)</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                <span>Possibilidade de personalização de trilhas de aprendizado</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                <span>Integração com ferramentas que sua empresa já usa</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                <span>Certificações e acompanhamento de compliance</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                <span>Garantia de qualidade humana (não apenas IA)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold">Como Implementar com Sucesso</h2>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Passo 1: Defina Objetivos Claros</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Identifique quais habilidades você deseja desenvolver na equipe e como isso se conecta
                aos objetivos de negócio. Seja específico: "Aumentar em 30% a taxa de conversão do time
                de vendas em 6 meses" é melhor que "Melhorar as vendas".
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Passo 2: Engaje os Líderes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Líderes devem ser os primeiros a usar a plataforma e dar o exemplo. Quando os gestores
                se engajam, a equipe segue naturalmente.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Passo 3: Comunicação é Fundamental</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Explique os benefícios tanto para a empresa quanto para o desenvolvimento individual dos
                colaboradores. Mostre que não é "mais uma tarefa", mas uma oportunidade de crescimento.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Passo 4: Crie uma Rotina de Aprendizado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Reserve 10-15 minutos diários para aprendizado. Com microlearning, é possível aprender
                entre uma reunião e outra, sem comprometer a produtividade.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Passo 5: Acompanhe e Ajuste</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Use os relatórios da plataforma para identificar o que está funcionando e o que precisa
                de ajuste. Educação corporativa é um processo contínuo de melhoria.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold">Métricas de Sucesso para Acompanhar</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-3 text-xl font-semibold">Métricas de Engajamento</h3>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Taxa de conclusão de cursos</li>
              <li>Frequência de acesso à plataforma</li>
              <li>Tempo médio gasto em aprendizado</li>
              <li>Número de colaboradores ativos</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-xl font-semibold">Métricas de Impacto no Negócio</h3>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Melhoria em KPIs específicos (vendas, atendimento, etc.)</li>
              <li>Redução de erros e retrabalho</li>
              <li>Aumento na satisfação de clientes</li>
              <li>Redução de turnover</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-8">
        <h2 className="mb-4 text-3xl font-bold">Por Que o TalentPass é Diferente?</h2>
        <div className="space-y-4 text-lg">
          <p>
            O TalentPass combina o melhor da tecnologia com curadoria humana. Nossa IA cria conteúdo
            personalizado, mas especialistas garantem qualidade e relevância.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="mb-2 font-semibold">⚡ Microlearning Real</h3>
              <p className="text-sm text-muted-foreground">
                Módulos de 3-10 minutos que cabem na rotina
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">🎯 Conteúdo Brasileiro</h3>
              <p className="text-sm text-muted-foreground">
                Adaptado à nossa realidade e cultura de negócios
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">📊 Analytics Poderoso</h3>
              <p className="text-sm text-muted-foreground">
                Veja o impacto real no desempenho da equipe
              </p>
            </div>
          </div>
          <div className="mt-6">
            <Link to="/signup">
              <Button size="lg" className="w-full md:w-auto">
                Começar Agora - É Grátis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-6 text-3xl font-bold">Conclusão</h2>
        <p className="mb-4 text-lg">
          Escolher a plataforma certa de educação corporativa é um investimento estratégico no futuro
          da sua empresa. Avalie cuidadosamente suas necessidades, teste as opções disponíveis e
          escolha uma solução que realmente agregue valor ao desenvolvimento da sua equipe.
        </p>
        <p className="text-lg text-muted-foreground">
          Lembre-se: a melhor plataforma é aquela que seus colaboradores vão realmente usar. Priorize
          simplicidade, relevância e resultados mensuráveis.
        </p>
      </section>
    </LegalPageLayout>
  );
};

export default CorporateEducationGuide;
