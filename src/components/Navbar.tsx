import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { LogOut, Menu, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/use-auth";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
] as const;

export function Navbar() {
  const { count } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function signOut() {
    await supabase.auth.signOut();
    router.invalidate();
    navigate({ to: "/", replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <ShoppingBag className="size-5" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">BuxMart</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              activeProps={{ className: "bg-accent text-accent-foreground" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="relative rounded-full">
            <Link to="/cart" aria-label="Cart">
              <ShoppingCart className="size-5" />
              {count > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
                  {count}
                </span>
              ) : null}
            </Link>
          </Button>

          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <span className="max-w-40 truncate text-sm text-muted-foreground">{user.email}</span>
              <Button variant="outline" size="sm" className="rounded-full" onClick={signOut}>
                <LogOut className="size-4" />
                Sign out
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button asChild variant="ghost" size="sm" className="rounded-full">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full">
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full md:hidden" aria-label="Menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl px-4 py-3 text-sm font-medium hover:bg-accent"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/cart"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium hover:bg-accent"
                >
                  Cart ({count})
                </Link>
                <div className="mt-4 border-t pt-4">
                  {user ? (
                    <Button
                      variant="outline"
                      className="w-full rounded-full"
                      onClick={() => {
                        setOpen(false);
                        void signOut();
                      }}
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button asChild className="w-full rounded-full" onClick={() => setOpen(false)}>
                        <Link to="/register">Create account</Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full rounded-full"
                        onClick={() => setOpen(false)}
                      >
                        <Link to="/login">
                          <User className="size-4" />
                          Log in
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
