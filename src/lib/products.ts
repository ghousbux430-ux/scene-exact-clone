import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  image_key: string;
  rating: number;
  stock: number;
  featured: boolean;
  on_offer: boolean;
  created_at: string;
};

const SELECT =
  "id,name,slug,description,price,category,image_key,rating,stock,featured,on_offer,created_at";

/** Database errors are plain objects; convert them to real Errors so they display and log properly. */
function toError(error: { message?: string; details?: string | null } | null | undefined): Error {
  const message = error?.message || "Could not load products";
  const err = new Error(message);
  if (error?.details) (err as Error & { details?: string }).details = error.details;
  return err;
}

/** Retry transient network failures a few times with backoff before surfacing an error. */
const retryOptions = {
  retry: 3,
  retryDelay: (attempt: number) => Math.min(500 * 2 ** attempt, 4000),
} as const;

export const productsQuery = () =>
  queryOptions({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select(SELECT)
        .order("created_at", { ascending: true });
      if (error) throw toError(error);
      return (data ?? []) as Product[];
    },
    ...retryOptions,
  });

export const productBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("products")
        .select(SELECT)
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw toError(error);
      return (data as Product | null) ?? null;
    },
    ...retryOptions,
  });
