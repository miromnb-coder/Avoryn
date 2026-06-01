import { MaterialCommunityIcons } from "@expo/vector-icons";

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export const categoryChips: { label: string; icon: IconName }[] = [
  { label: "Buy smart", icon: "cart-outline" },
  { label: "Free options", icon: "gift-outline" },
  { label: "Cheaper route", icon: "bus" },
  { label: "Check item", icon: "barcode-scan" },
];

export const smarterOptions: {
  title: string;
  description: string;
  detail: string;
  action: string;
  icon: IconName;
  tone: "mint" | "yellow" | "blue";
}[] = [
  {
    title: "Best overall",
    description: "Student lunch nearby • €3.20",
    detail: "Saves €8 vs average nearby lunch",
    action: "Go",
    icon: "crown-outline",
    tone: "mint",
  },
  {
    title: "Cheapest",
    description: "Grocery evening discount • starts at 20:00",
    detail: "Best if you can wait 45 min",
    action: "Save",
    icon: "tag-outline",
    tone: "yellow",
  },
  {
    title: "Fastest",
    description: "Bakery deal • 200 m away",
    detail: "Quickest pickup, 2 min away",
    action: "Navigate",
    icon: "lightning-bolt-outline",
    tone: "blue",
  },
];

export const nearbyPlaces = [
  {
    name: "Student Café",
    rating: "4.6",
    detail: "Lunch deal",
    meta: "180 m • €3.20",
    emoji: "🥗",
  },
  {
    name: "FreshMart",
    rating: "4.4",
    detail: "Evening discount",
    meta: "450 m • starts 20:00",
    emoji: "🛒",
  },
];
