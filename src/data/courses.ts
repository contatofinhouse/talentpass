import comunicacaoImg from "@/assets/course-comunicacao.jpg";
import vendasImg from "@/assets/course-vendas.jpg";
import marketingImg from "@/assets/course-marketing.jpg";
import gestaoImg from "@/assets/course-gestao.jpg";
import tiImg from "@/assets/course-ti.jpg";

export interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  videoUrl: string;
  content: string;
  skills: string[];
  image: string;
}

export const courses: Course[] = [
  {
    id: "1",
    title: "Técnicas de Fechamento de Vendas",
    category: "Vendas e Marketing",
    duration: "7 min",
    description: "Domine as principais técnicas de fechamento que aumentam sua taxa de conversão.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    image: vendasImg,
    content: `
      **Técnicas principais:**
      - Fechamento alternativo: ofereça duas opções positivas
      - Fechamento por escassez: destaque urgência ou exclusividade
      - Fechamento presumido: aja como se a venda já estivesse fechada
      - Fechamento por teste: pergunte "se resolvêssemos X, você fecharia?"
      
      **Dica de ouro:**
      Após apresentar a solução, faça silêncio. Quem fala primeiro, perde.
    `,
    skills: ["Vendas", "Negociação", "Persuasão"],
  },
  {
    id: "2",
    title: "SEO Básico para Iniciantes",
    category: "Vendas e Marketing",
    duration: "6 min",
    description: "Aprenda os fundamentos de SEO para melhorar o ranqueamento do seu site no Google.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    image: marketingImg,
    content: `
      **Fundamentos de SEO:**
      - Pesquisa de palavras-chave relevantes
      - Otimização de títulos e meta descriptions
      - Criação de conteúdo de qualidade
      - Link building interno e externo
      - Velocidade e responsividade do site
      
      **Checklist rápido:**
      ✓ Título com palavra-chave (até 60 caracteres)
      ✓ Meta description atraente (até 160 caracteres)
      ✓ URLs amigáveis e descritivas
      ✓ Imagens otimizadas com alt text
    `,
    skills: ["Marketing", "SEO", "Marketing Digital"],
  },
  {
    id: "3",
    title: "ChatGPT para Produtividade",
    category: "Automação com IA",
    duration: "6 min",
    description: "Aprenda a usar ChatGPT para automatizar tarefas do dia a dia e aumentar sua produtividade.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    image: tiImg,
    content: `
      **Casos de uso práticos:**
      - Redigir e-mails profissionais em segundos
      - Criar resumos de reuniões e documentos
      - Gerar ideias e brainstorming
      - Revisar e melhorar textos
      - Automatizar pesquisas e análises
      
      **Prompts eficazes:**
      Seja específico: "Aja como um [papel] e [ação] considerando [contexto]"
      
      **Exemplo:**
      "Aja como um gerente de vendas e crie um e-mail de follow-up para um cliente que demonstrou interesse em nosso produto de automação, mas ainda não fechou negócio."
    `,
    skills: ["IA", "Produtividade", "Automação"],
  },
  {
    id: "4",
    title: "Automação de Marketing com IA",
    category: "Automação com IA",
    duration: "7 min",
    description: "Descubra como ferramentas de IA podem automatizar suas campanhas de marketing e gerar melhores resultados.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    image: marketingImg,
    content: `
      **Ferramentas de IA para marketing:**
      - Criação de conteúdo: copy, imagens, vídeos
      - Personalização de campanhas em escala
      - Análise preditiva de comportamento
      - Segmentação automática de audiência
      - Otimização de anúncios em tempo real
      
      **Workflow automatizado:**
      1. IA analisa dados do cliente
      2. Segmenta audiências automaticamente
      3. Gera conteúdo personalizado
      4. Testa e otimiza campanhas
      5. Reporta resultados e insights
      
      **ROI:**
      Empresas que usam IA em marketing reportam aumento de 30-40% em conversões.
    `,
    skills: ["Marketing", "IA", "Automação", "Growth"],
  },
  {
    id: "5",
    title: "Comunicação Assertiva em 5 Minutos",
    category: "Gestão, Liderança e Comunicação",
    duration: "5 min",
    description: "Aprenda técnicas práticas para se comunicar de forma clara e objetiva em qualquer situação profissional.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    image: comunicacaoImg,
    content: `
      **Pontos-chave:**
      - Use linguagem clara e direta
      - Estruture sua mensagem: contexto, objetivo, ação
      - Pratique a escuta ativa
      - Adapte sua comunicação ao público
      
      **Exercício prático:**
      Hoje, em uma reunião ou conversa, pratique estruturar sua fala em 3 partes: o que aconteceu, o que você precisa, e qual a próxima ação.
    `,
    skills: ["Comunicação", "Soft Skills", "Liderança"],
  },
  {
    id: "6",
    title: "Gestão de Tempo e Prioridades",
    category: "Gestão, Liderança e Comunicação",
    duration: "6 min",
    description: "Métodos práticos para organizar seu dia e aumentar sua produtividade.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    image: gestaoImg,
    content: `
      **Técnica Pomodoro:**
      - 25 min de foco total
      - 5 min de pausa
      - A cada 4 ciclos, pausa de 15-30 min
      
      **Matriz de Eisenhower:**
      - Urgente + Importante = Faça agora
      - Importante + Não urgente = Agende
      - Urgente + Não importante = Delegue
      - Não urgente + Não importante = Elimine
      
      **Regra 2 minutos:**
      Se uma tarefa leva menos de 2 minutos, faça imediatamente.
    `,
    skills: ["Produtividade", "Gestão", "Soft Skills"],
  },
];
