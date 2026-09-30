import backpack from "@/assets/backpack.jpg";
import headphones from "@/assets/headphones.jpg";
import laptop from "@/assets/laptop.jpg";
import smartphone from "@/assets/smartphone.jpg";
import smartwatch from "@/assets/smartwatch.jpg";
import sneakers from "@/assets/sneakers.jpg";
import speaker from "@/assets/speaker.jpg";
import tshirt from "@/assets/tshirt.jpg";

const images: Record<string, string> = {
  backpack,
  headphones,
  laptop,
  smartphone,
  smartwatch,
  sneakers,
  speaker,
  tshirt,
};

export function productImage(key: string): string {
  return images[key] ?? headphones;
}

export const CATEGORIES = ["Electronics", "Fashion", "Home & Living", "Accessories"] as const;

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}
