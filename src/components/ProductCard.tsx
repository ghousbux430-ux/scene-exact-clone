import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { StarRating } from "@/components/StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatPrice, productImage } from "@/lib/product-images";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const soldOut = product.stock <= 0;

  return (
    <div className="card-lift group relative flex flex-col overflow-hidden rounded-3xl border bg-card shadow-card">
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="relative block overflow-hidden bg-surface"
      >
        <img
          src={productImage(product.image_key)}
          alt={product.name}
          loading="lazy"
          width={816}
          height={816}
          className="aspect-square w-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
        />
        {product.on_offer ? (
          <Badge className="absolute left-4 top-4 rounded-full px-3">Offer</Badge>
        ) : null}
        {soldOut ? (
          <Badge variant="secondary" className="absolute right-4 top-4 rounded-full px-3">
            Sold out
          </Badge>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-5 pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {product.category}
        </p>
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="font-display text-base font-semibold leading-snug transition-colors hover:text-primary"
        >
          {product.name}
        </Link>
        <StarRating rating={Number(product.rating)} />
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="font-display text-lg font-bold">{formatPrice(Number(product.price))}</span>
          <Button
            size="sm"
            className="rounded-full"
            disabled={soldOut}
            onClick={() => {
              addItem(product);
              toast.success(`${product.name} added to cart`);
            }}
          >
            <ShoppingCart className="size-4" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
