import comunicacaoImg from "@/assets/course-comunicacao.jpg";
import vendasImg from "@/assets/course-vendas.jpg";
import tiImg from "@/assets/course-ti.jpg";
import marketingImg from "@/assets/course-marketing.jpg";
import suporteImg from "@/assets/course-suporte.jpg";
import gestaoImg from "@/assets/course-gestao.jpg";

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
    title: "Comunicação Assertiva em 5 Minutos",
    category: "Comunicação",
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
    id: "2",
    title: "Técnicas de Fechamento de Vendas",
    category: "Vendas",
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
    id: "3",
    title: "Git e GitHub: Fundamentos",
    category: "TI",
    duration: "8 min",
    description: "Entenda os comandos essenciais de Git e como colaborar em projetos usando GitHub.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    image: tiImg,
    content: `
      **Comandos essenciais:**
      \`\`\`
      git init - Iniciar repositório
      git add . - Adicionar arquivos
      git commit -m "mensagem" - Salvar alterações
      git push - Enviar para repositório remoto
      git pull - Baixar atualizações
      \`\`\`
      
      **Workflow básico:**
      1. Clone o repositório
      2. Crie uma branch para sua feature
      3. Faça commits pequenos e descritivos
      4. Abra um Pull Request para revisão
    `,
    skills: ["TI", "Desenvolvimento", "Versionamento"],
  },
  {
    id: "4",
    title: "SEO Básico para Iniciantes",
    category: "Marketing",
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
    id: "5",
    title: "Atendimento ao Cliente de Excelência",
    category: "Suporte",
    duration: "5 min",
    description: "Técnicas para transformar problemas em oportunidades de fidelização.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    image: suporteImg,
    content: `
      **Pilares do atendimento:**
      1. Empatia: coloque-se no lugar do cliente
      2. Agilidade: responda rápido, mesmo que seja para dizer que está verificando
      3. Solução: foque em resolver, não em justificar
      4. Personalização: trate cada cliente como único
      
      **Frase de ouro:**
      "Entendo sua frustração. Vou resolver isso agora mesmo. Aqui está o que vou fazer..."
      
      **Transforme reclamações em oportunidades:**
      Cliente insatisfeito bem atendido é o melhor promotor da marca.
    `,
    skills: ["Atendimento", "Soft Skills", "CX"],
  },
  {
    id: "6",
    title: "Gestão de Tempo e Prioridades",
    category: "Comunicação",
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
