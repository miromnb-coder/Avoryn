import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const fallbackSupabaseUrl = "https://mdmxeimjtomnhymfikfr.supabase.co";
const fallbackSupabasePublishableKey = "sb_publishable_d8fWhE5LXyTOxBGh8Ht07w_o4fG4dO2";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || fallbackSupabaseUrl;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || fallbackSupabasePublishableKey;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
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
