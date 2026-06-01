import { MaterialCommunityIcons } from "@expo/vector-icons";

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export type ScenarioId = "buy" | "free" | "route" | "check";

export type SmarterOption = {
  title: string;
  description: string;
  detail: string;
  action: string;
  icon: IconName;
  tone: "mint" | "yellow" | "blue";
};

export type NearbyPlace = {
  name: string;
  rating: string;
  detail: string;
  meta: string;
  emoji: string;
};

export const categoryChips: { id: ScenarioId; label: string; icon: IconName }[] = [
  { id: "buy", label: "Buy\nsmart", icon: "cart-outline" },
  { id: "free", label: "Free\noptions", icon: "gift-outline" },
  { id: "route", label: "Cheaper\nroute", icon: "bus" },
  { id: "check", label: "Check\nitem", icon: "barcode-scan" },
];

export const scenarios: Record<
  ScenarioId,
  {
    query: string;
    savingsText: string;
    options: SmarterOption[];
    nearby: NearbyPlace[];
  }
> = {
  buy: {
    query: "Should I buy this today?",
    savingsText: "You saved €24 this week",
    options: [
      {
        title: "Best overall",
        description: "Buy used • €18",
        detail: "Save €22 vs new",
        action: "View",
        icon: "crown-outline",
        tone: "mint",
      },
      {
        title: "Cheapest",
        description: "Borrow nearby • free",
        detail: "Best for one-time use",
        action: "Ask",
        icon: "tag-outline",
        tone: "yellow",
      },
      {
        title: "Fastest",
        description: "Store nearby • €29",
        detail: "Pickup in 10 min",
        action: "Go",
        icon: "lightning-bolt-outline",
        tone: "blue",
      },
    ],
    nearby: [
      {
        name: "Used Market",
        rating: "4.7",
        detail: "Good deals",
        meta: "300 m • from €18",
        emoji: "🛍️",
      },
      {
        name: "Tech Store",
        rating: "4.3",
        detail: "Quick pickup",
        meta: "450 m • open now",
        emoji: "🔌",
      },
    ],
  },
  free: {
    query: "Find free options nearby",
    savingsText: "3 free options found nearby",
    options: [
      {
        title: "Best overall",
        description: "Library workspace • free",
        detail: "Quiet, close, no purchase",
        action: "Go",
        icon: "crown-outline",
        tone: "mint",
      },
      {
        title: "Cheapest",
        description: "Water refill • free",
        detail: "Save on small buys",
        action: "Save",
        icon: "tag-outline",
        tone: "yellow",
      },
      {
        title: "Fastest",
        description: "Charge spot • 120 m",
        detail: "Quick phone top-up",
        action: "Route",
        icon: "lightning-bolt-outline",
        tone: "blue",
      },
    ],
    nearby: [
      {
        name: "City Library",
        rating: "4.8",
        detail: "Free workspace",
        meta: "220 m • open",
        emoji: "📚",
      },
      {
        name: "Water Point",
        rating: "4.5",
        detail: "Bottle refill",
        meta: "160 m • free",
        emoji: "💧",
      },
    ],
  },
  route: {
    query: "Get there cheaper",
    savingsText: "Cheapest route saves €6",
    options: [
      {
        title: "Best overall",
        description: "Bus + walk • €2.80",
        detail: "Good price and time",
        action: "Route",
        icon: "crown-outline",
        tone: "mint",
      },
      {
        title: "Cheapest",
        description: "Walk • free",
        detail: "Best if not in a rush",
        action: "Plan",
        icon: "tag-outline",
        tone: "yellow",
      },
      {
        title: "Fastest",
        description: "Bike route • 11 min",
        detail: "Fast and low cost",
        action: "Start",
        icon: "lightning-bolt-outline",
        tone: "blue",
      },
    ],
    nearby: [
      {
        name: "Bus Stop",
        rating: "4.4",
        detail: "Next in 6 min",
        meta: "180 m • €2.80",
        emoji: "🚌",
      },
      {
        name: "Bike Point",
        rating: "4.6",
        detail: "Bikes available",
        meta: "260 m • 11 min",
        emoji: "🚲",
      },
    ],
  },
  check: {
    query: "Check if this is worth it",
    savingsText: "2 bad deals avoided",
    options: [
      {
        title: "Best overall",
        description: "Scan the item first",
        detail: "Compare price and value",
        action: "Scan",
        icon: "crown-outline",
        tone: "mint",
      },
      {
        title: "Cheapest",
        description: "Check used prices",
        detail: "Often 30–50% less",
        action: "Compare",
        icon: "tag-outline",
        tone: "yellow",
      },
      {
        title: "Smartest",
        description: "Wait 24 hours",
        detail: "Avoid impulse buying",
        action: "Remind",
        icon: "lightning-bolt-outline",
        tone: "blue",
      },
    ],
    nearby: [
      {
        name: "Price Check",
        rating: "4.6",
        detail: "Compare item",
        meta: "Scan first",
        emoji: "🔎",
      },
      {
        name: "Used Deals",
        rating: "4.5",
        detail: "Lower prices",
        meta: "Nearby options",
        emoji: "🏷️",
      },
    ],
  },
};

export const smarterOptions = scenarios.buy.options;
export const nearbyPlaces = scenarios.buy.nearby;
