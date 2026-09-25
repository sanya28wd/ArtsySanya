export const site = {
  name: "ArtsySanya",
  artist: "Sanya Wadhawan",
  url: "https://artsysanya.vercel.app",
  whatsapp: "971521078973",
  email: "sanya28wd@gmail.com",
  instagram: "https://www.instagram.com/artsysanyaa?igsi=NTU3Zmd6cnRxMzRs&utm_source=qr",
} as const;

export const whatsappLink = (message: string): string =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
