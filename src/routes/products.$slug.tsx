import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { Check, Minus, Plus, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ProductCard } from "@/components/ProductCard";
import { SiteLayout } from "@/components/SiteLayout";
import { StarRating } from "@/components/StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatPrice, productImage } from "@/lib/product-images";
import { productBySlugQuery, productsQuery } from "@/lib/products";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productBySlugQuery(params.slug));
    if (!product) throw notFound();
    await context.queryClient.ensureQueryData(productsQuery());
    return { name: product.name, description: product.description };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Product unavailable — BuxMart" }, { name: "robots", content: "noindex" }],
      };
    }
    return {
      meta: [
        { title: `${loaderData.name} — BuxMart` },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: `${loaderData.name} — BuxMart` },
        { property: "og:description", content: loaderData.description },
      ],
    };
  },
  notFoundComponent: ProductNotFound,
  component: ProductDetailPage,
});

function ProductNotFound() {
  return (
    <SiteLayout>
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-3xl font-bold">We couldn't find that product</h1>
        <p className="mt-2 text-sm text-muted-foreground">It may have sold out or been renamed.</p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/products">Back to products</Link>
        </Button>
      </div>
    </SiteLayout>
  );
}

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const { data: product } = useSuspenseQuery(productBySlugQuery(slug));
  const { data: products } = useSuspenseQuery(productsQuery());
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  if (!product) return <ProductNotFound />;

  const price = Number(product.price);
  const inStock = product.stock > 0;
  const related = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4);

  return (
    <SiteLayout>
      <div className="container-page py-10">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link to="/products" className="transition-colors hover:text-primary">
            Products
          </Link>
          <span className="px-2">/</span>
          <Link
            to="/products"
            search={{ category: product.category }}
            className="transition-colors hover:text-primary"
          >
            {product.category}
          </Link>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[2rem] border bg-surface shadow-card">
            <img
              src={productImage(product.image_key)}
              alt={product.name}
              width={816}
              height={816}
              className="aspect-square w-full object-contain p-10"
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="rounded-full">
                  {product.category}
                </Badge>
                {product.on_offer ? <Badge className="rounded-full">Special offer</Badge> : null}
              </div>
              <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{product.name}</h1>
              <StarRating rating={Number(product.rating)} />
            </div>

            <p className="text-base leading-relaxed text-muted-foreground">{product.description}</p>

            <p className="font-display text-4xl font-extrabold">{formatPrice(price)}</p>

            <p className="text-sm font-medium">
              {inStock ? (
                <span className="inline-flex items-center gap-2 text-success">
                  <Check className="size-4" /> In stock — {product.stock} available
                </span>
              ) : (
                <span className="text-destructive">Out of stock</span>
              )}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1 rounded-full border bg-card p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-full"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                >
                  <Minus className="size-4" />
                </Button>
                <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-full"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((value) => Math.min(product.stock || 1, value + 1))}
                >
                  <Plus className="size-4" />
                </Button>
              </div>

              <Button
                size="lg"
                variant="outline"
                className="rounded-full"
                disabled={!inStock}
                onClick={() => {
                  addItem(product, quantity);
                  toast.success(`${product.name} added to cart`);
                }}
              >
                <ShoppingCart className="size-4" />
                Add to cart
              </Button>

              <Button
                size="lg"
                className="rounded-full px-8"
                disabled={!inStock}
                onClick={() => {
                  addItem(product, quantity);
                  navigate({ to: "/checkout" });
                }}
              >
                Buy now
              </Button>
            </div>

            <div className="grid gap-3 rounded-3xl border bg-surface p-5 text-sm text-muted-foreground sm:grid-cols-2">
              <span className="inline-flex items-center gap-2">
                <Truck className="size-4 text-primary" /> Free delivery over $100
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" /> 30-day easy returns
              </span>
            </div>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-16">
            <h2 className="mb-6 font-display text-2xl font-bold">You might also like</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </SiteLayout>
  );
}
