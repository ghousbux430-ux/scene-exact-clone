import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart";
import { formatPrice, productImage } from "@/lib/product-images";
import { useAuth } from "@/lib/use-auth";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — BuxMart" },
      { name: "description", content: "Enter your shipping details and place your BuxMart order." },
      { property: "og:title", content: "Checkout — BuxMart" },
      { property: "og:description", content: "Complete your BuxMart order securely." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, shipping, total, clear } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [placing, setPlacing] = useState(false);
  const [placedId, setPlacedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  function field(key: keyof typeof form) {
    return {
      value: form[key],
      onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
        setForm((current) => ({ ...current, [key]: event.target.value })),
    };
  }

  async function placeOrder(event: React.FormEvent) {
    event.preventDefault();
    if (!user) return;
    setPlacing(true);

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        full_name: form.fullName,
        email: form.email || (user.email ?? ""),
        phone: form.phone || null,
        address_line: form.address,
        city: form.city,
        postal_code: form.postalCode || null,
        country: form.country,
        total,
      })
      .select("id")
      .single();

    if (error || !order) {
      setPlacing(false);
      toast.error("We couldn't place your order. Please try again.");
      return;
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
      })),
    );

    setPlacing(false);
    if (itemsError) {
      toast.error("Your order was saved but some items failed. Please contact support.");
      return;
    }

    setPlacedId(order.id);
    clear();
    toast.success("Order placed!");
  }

  if (placedId) {
    return (
      <SiteLayout>
        <div className="container-page py-20">
          <div className="mx-auto max-w-lg rounded-[2rem] border bg-card p-10 text-center shadow-card">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent text-success">
              <CheckCircle2 className="size-7" />
            </span>
            <h1 className="mt-5 font-display text-2xl font-extrabold">Thank you for your order!</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Your order reference is{" "}
              <strong className="text-foreground">{placedId.slice(0, 8).toUpperCase()}</strong>. We've
              saved your shipping details and will email you when it ships.
            </p>
            <Button asChild className="mt-6 rounded-full px-7">
              <Link to="/products">Keep shopping</Link>
            </Button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!authLoading && !user) {
    return (
      <SiteLayout>
        <div className="container-page py-20">
          <div className="mx-auto max-w-md rounded-[2rem] border bg-card p-10 text-center shadow-card">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
              <Lock className="size-6" />
            </span>
            <h1 className="mt-5 font-display text-2xl font-extrabold">Sign in to checkout</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Your cart is saved. Log in or create an account to place this order.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/register">Create account</Link>
              </Button>
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (items.length === 0) {
    return (
      <SiteLayout>
        <div className="container-page py-20 text-center">
          <h1 className="font-display text-3xl font-extrabold">Your cart is empty</h1>
          <p className="mt-2 text-sm text-muted-foreground">Add a product before checking out.</p>
          <Button asChild className="mt-6 rounded-full px-7">
            <Link to="/products">Shop products</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container-page py-10">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Checkout</h1>

        <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <section className="rounded-3xl border bg-card p-6 shadow-card">
              <h2 className="font-display text-lg font-bold">Customer information</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input id="fullName" required className="rounded-xl" {...field("fullName")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    className="rounded-xl"
                    placeholder={user?.email ?? "you@example.com"}
                    {...field("email")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input id="phone" className="rounded-xl" {...field("phone")} />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border bg-card p-6 shadow-card">
              <h2 className="font-display text-lg font-bold">Shipping address</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Street address</Label>
                  <Input id="address" required className="rounded-xl" {...field("address")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" required className="rounded-xl" {...field("city")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal code</Label>
                  <Input id="postalCode" className="rounded-xl" {...field("postalCode")} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" required className="rounded-xl" {...field("country")} />
                </div>
              </div>
            </section>
          </div>

          <aside className="h-fit space-y-4 rounded-3xl border bg-card p-6 shadow-card lg:sticky lg:top-24">
            <h2 className="font-display text-lg font-bold">Order summary</h2>
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <img
                    src={productImage(item.imageKey)}
                    alt={item.name}
                    loading="lazy"
                    width={816}
                    height={816}
                    className="size-14 rounded-xl bg-surface object-contain p-1"
                  />
                  <div className="flex-1 text-sm">
                    <p className="font-medium leading-tight">{item.name}</p>
                    <p className="text-muted-foreground">Qty {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="space-y-3 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-medium">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="font-medium">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t pt-3 text-base">
                <dt className="font-semibold">Total</dt>
                <dd className="font-display font-bold">{formatPrice(total)}</dd>
              </div>
            </dl>

            <Button type="submit" size="lg" className="w-full rounded-full" disabled={placing}>
              {placing ? "Placing order..." : "Place order"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              No payment is taken — this order is recorded for fulfilment.
            </p>
          </aside>
        </form>
      </div>
    </SiteLayout>
  );
}
