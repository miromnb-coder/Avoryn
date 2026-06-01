import { useCallback, useEffect, useState } from "react";
import { Place, supabase } from "../lib/supabase";

export function usePlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchPlaces = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from("places")
      .select("id,name,type,latitude,longitude,description,price_hint,rating,is_free,created_at")
      .order("name", { ascending: true });

    if (error) {
      setErrorMessage(error.message);
      setPlaces([]);
    } else {
      setPlaces((data ?? []) as Place[]);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  return {
    places,
    isLoading,
    errorMessage,
    fetchPlaces,
  };
}
