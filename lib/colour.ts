export const colourFamilies = ["Crimson", "Coral", "Gold", "Green", "Turquoise", "Blue", "Violet", "Rose", "Monochrome"] as const;

export type ColourFamily = (typeof colourFamilies)[number];

type Rgb = { readonly red: number; readonly green: number; readonly blue: number };

const parseHex = (hex: string): Rgb => ({
  red: Number.parseInt(hex.slice(1, 3), 16),
  green: Number.parseInt(hex.slice(3, 5), 16),
  blue: Number.parseInt(hex.slice(5, 7), 16),
});

const hueFromRgb = ({ red, green, blue }: Rgb): number => {
  const max = Math.max(red, green, blue) / 255;
  const min = Math.min(red, green, blue) / 255;
  const delta = max - min;
  if (delta === 0) return 0;
  if (max === red / 255) return 60 * (((green - blue) / 255 / delta) % 6);
  if (max === green / 255) return 60 * (((blue - red) / 255 / delta) + 2);
  return 60 * (((red - green) / 255 / delta) + 4);
};

export const toColourFamily = (hex: string): ColourFamily => {
  const { red, green, blue } = parseHex(hex);
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  if (maximum - minimum < 34) return "Monochrome";
  const hue = (hueFromRgb({ red, green, blue }) + 360) % 360;
  if (hue < 12 || hue >= 345) return "Crimson";
  if (hue < 31) return "Coral";
  if (hue < 65) return "Gold";
  if (hue < 160) return "Green";
  if (hue < 192) return "Turquoise";
  if (hue < 252) return "Blue";
  if (hue < 302) return "Violet";
  return "Rose";
};

export const hasColourFamily = (colours: readonly string[], family: ColourFamily): boolean => colours.some((colour) => toColourFamily(colour) === family);
