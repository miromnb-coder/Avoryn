import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mdmxeimjtomnhymfikfr.supabase.co";
const supabasePublishableKey = "sb_publishable_d8fWhE5LXyTOxBGh8Ht07w_o4fG4dO2";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

export type Place = {
  id: string;
  name: string;
  type: "food" | "store" | "library" | "repair" | "transport" | "workspace" | "water" | "charging" | "other";
  latitude: number;
  longitude: number;
  description: string;
  price_hint: string | null;
  rating: number | null;
  is_free: boolean;
  created_at: string;
};
