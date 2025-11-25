import jsPDF from "jspdf";

const CERTIFICATE_TEMPLATE_PATH = "/certificate-template.jpg";

interface CertificateData {
  courseName: string;
  category: string;
  skills: string[];
  userName: string;
  completionDate: Date;
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);

const loadImageElement = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const loadImageAsDataURL = async (src: string): Promise<string | null> => {
  try {
    const img = await loadImageElement(src);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.95);
  } catch (error) {
    console.error("Erro ao carregar template do certificado", error);
    return null;
  }
};

export const generateCertificate = async (data: CertificateData) => {
  const { courseName, category, skills, userName, completionDate } = data;
  const bullet = "•";

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Fundo com template
  const bgDataUrl = await loadImageAsDataURL(CERTIFICATE_TEMPLATE_PATH);
  if (bgDataUrl) {
    doc.addImage(bgDataUrl, "JPEG", 0, 0, pageWidth, pageHeight);
  }

  const centerX = pageWidth / 2;

  // Titulo
  doc.setTextColor(34, 68, 112);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("TALENTPASS", centerX, 35, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.text("Certificado de Conclus\u00e3o", centerX, 44, { align: "center" });

  // Corpo
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(12);
  doc.text("Certificamos que", centerX, 70, { align: "center" });

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(userName, centerX, 80, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(12);
  doc.text("concluiu com sucesso o curso:", centerX, 90, { align: "center" });

  // Separador fino
  doc.setDrawColor(170, 170, 170);
  doc.setLineWidth(0.3);
  doc.line(35, 96, pageWidth - 35, 96);

  // Nome do curso
  doc.setFont("helvetica", "bold");
  doc.setTextColor(45, 56, 76);
  doc.setFontSize(18);
  const courseLines = doc.splitTextToSize(courseName, pageWidth - 40);
  doc.text(courseLines, centerX, 105, {
    align: "center",
    lineHeightFactor: 1.2,
  });
  const courseHeight = (courseLines.length - 1) * 6;

  // Categoria
  doc.setFont("helvetica", "italic");
  doc.setTextColor(90, 90, 90);
  doc.setFontSize(11);
  doc.text(`Categoria: ${category}`, centerX, 118 + courseHeight, {
    align: "center",
  });

  // Competencias
  const skillsLabelY = 138 + courseHeight;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(45, 56, 76);
  doc.setFontSize(12);
  doc.text("Compet\u00eancias desenvolvidas:", centerX, skillsLabelY, {
    align: "center",
  });

  const skillsText =
    skills && skills.length > 0 ? skills.slice(0, 8).join(` ${bullet} `) : "—";
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(11);
  const skillsLines = doc.splitTextToSize(skillsText, pageWidth - 40);
  doc.text(skillsLines, centerX, skillsLabelY + 8, {
    align: "center",
    lineHeightFactor: 1.2,
  });

  // Data
  doc.setFont("helvetica", "normal");
  doc.setTextColor(70, 70, 70);
  doc.setFontSize(11);
  doc.text(`Data de conclus\u00e3o: ${formatDate(completionDate)}`, centerX, pageHeight - 30, {
    align: "center",
  });

  // Emissor
  doc.setFont("helvetica", "bold");
  doc.setTextColor(45, 56, 76);
  doc.setFontSize(12);
  doc.text("Curso emitido por: TALENT PASS", centerX, pageHeight - 20, {
    align: "center",
  });

  // Rodape
  doc.setFont("helvetica", "italic");
  doc.setTextColor(90, 90, 90);
  doc.setFontSize(9);
  doc.text("www.talentpass.com.br", centerX, pageHeight - 12, {
    align: "center",
  });

  const fileName = `Certificado_${courseName.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
  doc.save(fileName);
};

export const generateCertificateImage = async (data: CertificateData): Promise<string> => {
  const { courseName, category, skills, userName, completionDate } = data;
  const bullet = "•";

  try {
    const bgImage = await loadImageElement(CERTIFICATE_TEMPLATE_PATH).catch(() => null);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    canvas.width = bgImage?.naturalWidth || bgImage?.width || 3508;
    canvas.height = bgImage?.naturalHeight || bgImage?.height || 2480;

    // Conversao mm -> px mantendo proporcao A4
    const mmToPxX = (mm: number) => (canvas.width / 297) * mm;
    const mmToPxY = (mm: number) => (canvas.height / 210) * mm;
    const centerX = canvas.width / 2;

    const drawCenteredText = (
      text: string,
      y: number,
      font: string,
      color: string
    ) => {
      ctx.font = font;
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.fillText(text, centerX, y);
    };

    const drawWrappedCenteredText = (
      text: string,
      y: number,
      font: string,
      color: string,
      maxWidth: number,
      lineHeight: number
    ) => {
      ctx.font = font;
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      const words = text.split(/\\s+/);
      const lines: string[] = [];
      let current = "";
      words.forEach((word) => {
        const testLine = current ? `${current} ${word}` : word;
        const { width } = ctx.measureText(testLine);
        if (width > maxWidth && current) {
          lines.push(current);
          current = word;
        } else {
          current = testLine;
        }
      });
      if (current) lines.push(current);

      lines.forEach((line, index) => {
        ctx.fillText(line, centerX, y + index * lineHeight);
      });

      return lines.length;
    };

    // Fundo do certificado
    if (bgImage) {
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const yTitle = mmToPxY(35);
    drawCenteredText("TALENTPASS", yTitle, `bold ${mmToPxY(7)}px Arial`, "#224470");
    drawCenteredText(
      "Certificado de Conclus\u00e3o",
      yTitle + mmToPxY(7),
      `${mmToPxY(4.8)}px Arial`,
      "#3a3a3a"
    );

    // Corpo
    drawCenteredText(
      "Certificamos que",
      mmToPxY(70),
      `${mmToPxY(4.4)}px Arial`,
      "#3a3a3a"
    );

    drawCenteredText(
      userName,
      mmToPxY(80),
      `bold ${mmToPxY(6.4)}px Arial`,
      "#000000"
    );

    drawCenteredText(
      "concluiu com sucesso o curso:",
      mmToPxY(90),
      `${mmToPxY(4.4)}px Arial`,
      "#3a3a3a"
    );

    // Linha divisoria sutil
    ctx.strokeStyle = "#a8a8a8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(mmToPxX(35), mmToPxY(94));
    ctx.lineTo(canvas.width - mmToPxX(35), mmToPxY(94));
    ctx.stroke();

    // Nome do curso
    const courseY = mmToPxY(105);
    const courseLines = drawWrappedCenteredText(
      courseName,
      courseY,
      `bold ${mmToPxY(6)}px Arial`,
      "#2d384c",
      canvas.width - mmToPxX(40),
      mmToPxY(6.4)
    );

    // Categoria
    drawCenteredText(
      `Categoria: ${category}`,
      courseY + courseLines * mmToPxY(6.4) + mmToPxY(6),
      `italic ${mmToPxY(4.4)}px Arial`,
      "#5a5a5a"
    );

    // Competencias
    const skillsLabelY = courseY + courseLines * mmToPxY(6.4) + mmToPxY(20);
    drawCenteredText(
      "Compet\u00eancias desenvolvidas:",
      skillsLabelY,
      `bold ${mmToPxY(4.6)}px Arial`,
      "#2d384c"
    );

    const skillsText =
      skills && skills.length > 0 ? skills.slice(0, 8).join(` ${bullet} `) : "—";
    drawWrappedCenteredText(
      skillsText,
      skillsLabelY + mmToPxY(6.2),
      `${mmToPxY(4.2)}px Arial`,
      "#323232",
      canvas.width - mmToPxX(40),
      mmToPxY(5.6)
    );

    // Data e emissor
    drawCenteredText(
      `Data de conclus\u00e3o: ${formatDate(completionDate)}`,
      canvas.height - mmToPxY(28),
      `${mmToPxY(4.2)}px Arial`,
      "#464646"
    );

    drawCenteredText(
      "Curso emitido por: TALENT PASS",
      canvas.height - mmToPxY(18),
      `bold ${mmToPxY(4.4)}px Arial`,
      "#2d384c"
    );

    drawCenteredText(
      "www.talentpass.com.br",
      canvas.height - mmToPxY(10),
      `italic ${mmToPxY(3.6)}px Arial`,
      "#4f4f4f"
    );

    return canvas.toDataURL("image/jpeg", 0.95);
  } catch (error) {
    console.error("Erro ao gerar imagem do certificado", error);
    return "";
  }
};
