import { Link, createFileRoute } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { FREE_SHIPPING_THRESHOLD, useCart } from "@/lib/cart";
import { formatPrice, productImage } from "@/lib/product-images";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — BuxMart" },
      { name: "description", content: "Review the items in your BuxMart cart and checkout." },
      { property: "og:title", content: "Your cart — BuxMart" },
      { property: "og:description", content: "Review your BuxMart items and place your order." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, shipping, total, setQuantity, removeItem } = useCart();

  return (
    <SiteLayout>
      <div className="container-page py-10">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Your cart</h1>

        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl border bg-card p-12 text-center shadow-card">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
              <ShoppingBag className="size-6" />
            </span>
            <h2 className="mt-5 font-display text-xl font-semibold">Your cart is empty</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse the store and add something you love.
            </p>
            <Button asChild className="mt-6 rounded-full px-7">
              <Link to="/products">Shop products</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-3xl border bg-card p-4 shadow-card sm:flex-row sm:items-center"
                >
                  <Link
                    to="/products/$slug"
                    params={{ slug: item.slug }}
                    className="shrink-0 overflow-hidden rounded-2xl bg-surface"
                  >
                    <img
                      src={productImage(item.imageKey)}
                      alt={item.name}
                      loading="lazy"
                      width={816}
                      height={816}
                      className="size-24 object-contain p-2"
                    />
                  </Link>

                  <div className="flex-1">
                    <Link
                      to="/products/$slug"
                      params={{ slug: item.slug }}
                      className="font-display font-semibold transition-colors hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatPrice(item.price)} each
                    </p>
                  </div>

                  <div className="flex items-center gap-1 rounded-full border p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 rounded-full"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="size-4" />
                    </Button>
                    <span className="w-9 text-center text-sm font-semibold">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 rounded-full"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>

                  <p className="w-24 text-right font-display font-bold">
                    {formatPrice(item.price * item.quantity)}
                  </p>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-muted-foreground"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>

            <aside className="h-fit space-y-4 rounded-3xl border bg-card p-6 shadow-card lg:sticky lg:top-24">
              <h2 className="font-display text-lg font-bold">Order summary</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-medium">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="font-medium">
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </dd>
                </div>
                <div className="flex justify-between border-t pt-3 text-base">
                  <dt className="font-semibold">Total</dt>
                  <dd className="font-display font-bold">{formatPrice(total)}</dd>
                </div>
              </dl>
              {shipping > 0 ? (
                <p className="text-xs text-muted-foreground">
                  Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free delivery.
                </p>
              ) : null}
              <Button asChild size="lg" className="w-full rounded-full">
                <Link to="/checkout">Proceed to checkout</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full rounded-full">
                <Link to="/products">Continue shopping</Link>
              </Button>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
