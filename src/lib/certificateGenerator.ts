import jsPDF from "jspdf";

interface CertificateData {
  courseName: string;
  category: string;
  skills: string[];
  userName: string;
  completionDate: Date;
}

export const generateCertificate = (data: CertificateData) => {
  const { courseName, category, skills, userName, completionDate } = data;

  // Criar documento PDF em formato paisagem (landscape)
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Bordas decorativas
  doc.setDrawColor(79, 70, 229); // primary color
  doc.setLineWidth(2);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  doc.setLineWidth(0.5);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Logo/Título TalentPass
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229); // primary color
  doc.text("🎓 TALENTPASS", pageWidth / 2, 30, { align: "center" });

  // Subtítulo
  doc.setFontSize(18);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Certificado de Conclusão", pageWidth / 2, 42, { align: "center" });

  // Linha divisória
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(0.3);
  doc.line(60, 48, pageWidth - 60, 48);

  // Corpo do certificado
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.text("Certificamos que", pageWidth / 2, 60, { align: "center" });

  // Nome do usuário (destaque)
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(userName, pageWidth / 2, 72, { align: "center" });

  // Texto complementar
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.text("concluiu com sucesso o curso:", pageWidth / 2, 82, { align: "center" });

  // Nome do curso (destaque)
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text(courseName, pageWidth / 2, 94, { align: "center", maxWidth: pageWidth - 60 });

  // Categoria
  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 100, 100);
  doc.text(`Categoria: ${category}`, pageWidth / 2, 104, { align: "center" });

  // Skills desenvolvidas
  if (skills && skills.length > 0) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text("Competências desenvolvidas:", pageWidth / 2, 116, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const skillsText = skills.slice(0, 5).map((skill) => `• ${skill}`).join("   ");
    doc.text(skillsText, pageWidth / 2, 124, { align: "center", maxWidth: pageWidth - 60 });
  }

  // Data de conclusão
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  const formattedDate = completionDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.text(`Data de conclusão: ${formattedDate}`, pageWidth / 2, pageHeight - 40, { align: "center" });

  // Linha de assinatura
  doc.setLineWidth(0.3);
  doc.setDrawColor(100, 100, 100);
  doc.line(pageWidth / 2 - 30, pageHeight - 30, pageWidth / 2 + 30, pageHeight - 30);

  // Assinatura
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text("TalentPass Team", pageWidth / 2, pageHeight - 24, { align: "center" });

  // Rodapé
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(120, 120, 120);
  doc.text("www.talentpass.com.br", pageWidth / 2, pageHeight - 15, { align: "center" });

  // Salvar PDF
  const fileName = `Certificado_${courseName.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
  doc.save(fileName);
};

export const generateCertificateImage = (data: CertificateData): Promise<string> => {
  return new Promise((resolve) => {
    const { courseName, category, skills, userName, completionDate } = data;

    // Criar canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve('');
      return;
    }

    // Dimensões A4 landscape em pixels (300 DPI)
    canvas.width = 3508;
    canvas.height = 2480;

    // Fundo branco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Bordas decorativas
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

    // Logo/Título TalentPass
    ctx.fillStyle = '#4F46E5';
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎓 TALENTPASS', canvas.width / 2, 250);

    // Subtítulo
    ctx.font = '72px Arial';
    ctx.fillStyle = '#646464';
    ctx.fillText('Certificado de Conclusão', canvas.width / 2, 360);

    // Linha divisória
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(600, 420);
    ctx.lineTo(canvas.width - 600, 420);
    ctx.stroke();

    // Texto "Certificamos que"
    ctx.font = '48px Arial';
    ctx.fillStyle = '#323232';
    ctx.fillText('Certificamos que', canvas.width / 2, 560);

    // Nome do usuário
    ctx.font = 'bold 88px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText(userName, canvas.width / 2, 700);

    // Texto "concluiu com sucesso o curso:"
    ctx.font = '48px Arial';
    ctx.fillStyle = '#323232';
    ctx.fillText('concluiu com sucesso o curso:', canvas.width / 2, 800);

    // Nome do curso
    ctx.font = 'bold 72px Arial';
    ctx.fillStyle = '#4F46E5';
    const maxWidth = canvas.width - 600;
    ctx.fillText(courseName, canvas.width / 2, 940, maxWidth);

    // Categoria
    ctx.font = 'italic 44px Arial';
    ctx.fillStyle = '#646464';
    ctx.fillText(`Categoria: ${category}`, canvas.width / 2, 1040);

    // Skills
    if (skills && skills.length > 0) {
      ctx.font = 'bold 44px Arial';
      ctx.fillStyle = '#323232';
      ctx.fillText('Competências desenvolvidas:', canvas.width / 2, 1180);

      ctx.font = '40px Arial';
      const skillsText = skills.slice(0, 5).map((skill) => `• ${skill}`).join('   ');
      ctx.fillText(skillsText, canvas.width / 2, 1260, maxWidth);
    }

    // Data de conclusão
    ctx.font = '40px Arial';
    ctx.fillStyle = '#505050';
    const formattedDate = completionDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    ctx.fillText(`Data de conclusão: ${formattedDate}`, canvas.width / 2, canvas.height - 400);

    // Linha de assinatura
    ctx.strokeStyle = '#646464';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 300, canvas.height - 280);
    ctx.lineTo(canvas.width / 2 + 300, canvas.height - 280);
    ctx.stroke();

    // Assinatura
    ctx.font = 'bold 40px Arial';
    ctx.fillStyle = '#4F46E5';
    ctx.fillText('TalentPass Team', canvas.width / 2, canvas.height - 220);

    // Rodapé
    ctx.font = 'italic 32px Arial';
    ctx.fillStyle = '#787878';
    ctx.fillText('www.talentpass.com.br', canvas.width / 2, canvas.height - 130);

    // Converter para data URL
    resolve(canvas.toDataURL('image/png'));
  });
};
