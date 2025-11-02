import { MessageCircle } from "lucide-react";

export const getWhatsAppUrl = (customMessage?: string) => {
  const phoneNumber = "5511955842951";
  const message = customMessage || "Olá! Gostaria de saber mais sobre a TalentPass.";
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};

const WhatsAppButton = () => {
  const whatsappUrl = getWhatsAppUrl();

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl"
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
};

export default WhatsAppButton;
