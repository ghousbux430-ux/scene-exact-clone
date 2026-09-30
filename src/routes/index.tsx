import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Headphones, Home, Shirt, Sparkles, Truck, Watch } from "lucide-react";

import { ProductCard } from "@/components/ProductCard";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-shopping.jpg";
import { formatPrice } from "@/lib/product-images";
import { productsQuery } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BuxMart — Shop electronics, fashion, home & accessories" },
      {
        name: "description",
        content:
          "BuxMart is your modern online store for headphones, watches, laptops, sneakers and everyday essentials. Free delivery over $100.",
      },
      { property: "og:title", content: "BuxMart — Modern online shopping" },
      {
        property: "og:description",
        content:
          "Browse featured picks, new arrivals and special offers across electronics, fashion, home and accessories.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery()),
  component: HomePage,
});

const categoryCards = [
  { name: "Electronics", icon: Headphones, blurb: "Audio, laptops & phones" },
  { name: "Fashion", icon: Shirt, blurb: "Everyday wear & footwear" },
  { name: "Home & Living", icon: Home, blurb: "Comfort for every room" },
  { name: "Accessories", icon: Watch, blurb: "Bags, straps & extras" },
] as const;

function HomePage() {
  const { data: products } = useSuspenseQuery(productsQuery());
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const newArrivals = [...products].reverse().slice(0, 4);
  const offers = products.filter((product) => product.on_offer).slice(0, 3);

  return (
    <SiteLayout>
      <section className="hero-glow border-b">
        <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
              <Sparkles className="size-3.5" />
              New season drop
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              Everything you need, <span className="text-primary">in one bright place.</span>
            </h1>
            <p className="max-w-lg text-base text-muted-foreground sm:text-lg">
              Tech, fashion and home essentials curated for real life. Fair prices, honest reviews and
              free delivery on orders over {formatPrice(100)}.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link to="/products">
                  Start shopping
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                <Link to="/products" search={{ sort: "price-asc" }}>
                  Best value first
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 pt-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Truck className="size-4 text-primary" /> Free delivery over $100
              </span>
              <span className="inline-flex items-center gap-2">
                <Sparkles className="size-4 text-primary" /> 30-day returns
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border bg-surface shadow-card">
            <img
              src={heroImage}
              alt="Shopper carrying BuxMart bags"
              width={1280}
              height={1024}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Shop by category</h2>
            <p className="mt-1 text-sm text-muted-foreground">Find your aisle in a tap.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryCards.map((category) => (
            <Link
              key={category.name}
              to="/products"
              search={{ category: category.name }}
              className="card-lift group flex items-center gap-4 rounded-3xl border bg-card p-5 shadow-card"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground">
                <category.icon className="size-5" />
              </span>
              <span>
                <span className="block font-display font-semibold group-hover:text-primary">
                  {category.name}
                </span>
                <span className="block text-xs text-muted-foreground">{category.blurb}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page py-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Featured products</h2>
            <p className="mt-1 text-sm text-muted-foreground">Our best-loved picks this week.</p>
          </div>
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/products">
              View all
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="container-page py-14">
        <div className="rounded-[2rem] border bg-surface p-6 sm:p-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">Special offers</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Limited-time pricing while stock lasts.
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/products">Browse everything</Link>
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page pb-4">
        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">New arrivals</h2>
          <p className="mt-1 text-sm text-muted-foreground">Fresh in the store right now.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
