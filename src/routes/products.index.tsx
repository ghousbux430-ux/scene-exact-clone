import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { ProductCard } from "@/components/ProductCard";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/product-images";
import { productsQuery } from "@/lib/products";

type ProductSearch = {
  q?: string | undefined;
  category?: string | undefined;
  sort?: "newest" | "price-asc" | "price-desc" | "rating" | undefined;
};

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): ProductSearch => ({
    q: typeof search['q'] === "string" && search['q'] ? search['q'] : undefined,
    category:
      typeof search['category'] === "string" && search['category'] ? search['category'] : undefined,
    sort:
      search['sort'] === "price-asc" ||
      search['sort'] === "price-desc" ||
      search['sort'] === "rating" ||
      search['sort'] === "newest"
        ? search['sort']
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "All products — BuxMart" },
      {
        name: "description",
        content:
          "Browse the full BuxMart catalogue. Search, filter by category and sort by price or rating.",
      },
      { property: "og:title", content: "All products — BuxMart" },
      {
        property: "og:description",
        content: "Search and filter electronics, fashion, home and accessories at BuxMart.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery()),
  component: ProductsPage,
});

function ProductsPage() {
  const { data: products } = useSuspenseQuery(productsQuery());
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const query = (search.q ?? "").toLowerCase();
  const sort = search.sort ?? "newest";

  let visible = products.filter((product) => {
    const matchesQuery =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);
    const matchesCategory = !search.category || product.category === search.category;
    return matchesQuery && matchesCategory;
  });

  visible = [...visible].sort((a, b) => {
    if (sort === "price-asc") return Number(a.price) - Number(b.price);
    if (sort === "price-desc") return Number(b.price) - Number(a.price);
    if (sort === "rating") return Number(b.rating) - Number(a.rating);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  function update(next: Partial<ProductSearch>) {
    navigate({ search: (prev) => ({ ...prev, ...next }) });
  }

  return (
    <SiteLayout>
      <div className="container-page py-10">
        <header className="mb-8">
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">All products</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {visible.length} item{visible.length === 1 ? "" : "s"} available
          </p>
        </header>

        <div className="mb-8 flex flex-col gap-3 rounded-3xl border bg-card p-4 shadow-card md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search.q ?? ""}
              onChange={(event) => update({ q: event.target.value || undefined })}
              placeholder="Search products..."
              className="rounded-full pl-9"
            />
          </div>

          <Select
            value={search.category ?? "all"}
            onValueChange={(value) => update({ category: value === "all" ? undefined : value })}
          >
            <SelectTrigger className="rounded-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(value) => update({ sort: value as ProductSearch["sort"] })}>
            <SelectTrigger className="rounded-full md:w-48">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {visible.length === 0 ? (
          <div className="rounded-3xl border bg-card p-12 text-center shadow-card">
            <h2 className="font-display text-xl font-semibold">No products match your filters</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different search term or clear the filters.
            </p>
            <Button
              className="mt-6 rounded-full"
              onClick={() => navigate({ search: {} })}
              variant="outline"
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
