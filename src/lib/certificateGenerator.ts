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
