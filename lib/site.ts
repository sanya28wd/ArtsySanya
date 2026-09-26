const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const publicAsset = (path: string): string => `${publicBasePath}${path}`;

export const site = {
  name: "ArtsySanya",
  artist: "Sanya Wadhawan",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://artsysanya.vercel.app",
  whatsapp: "971521078973",
  email: "sanya28wd@gmail.com",
  instagram: "https://www.instagram.com/artsysanyaa?igsi=NTU3Zmd6cnRxMzRs&utm_source=qr",
} as const;

export const whatsappLink = (message: string): string =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
