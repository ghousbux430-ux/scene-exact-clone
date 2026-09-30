import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";

import { CATEGORIES } from "@/lib/product-images";

export function Footer() {
  return (
    <footer className="mt-20 border-t bg-surface text-surface-foreground">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <ShoppingBag className="size-5" />
            </span>
            <span className="font-display text-xl font-bold">BuxMart</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Everyday essentials and modern tech, shipped fast and priced fairly.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {CATEGORIES.map((category) => (
              <li key={category}>
                <Link
                  to="/products"
                  search={{ category }}
                  className="transition-colors hover:text-primary"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Account</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/login" className="transition-colors hover:text-primary">
                Log in
              </Link>
            </li>
            <li>
              <Link to="/register" className="transition-colors hover:text-primary">
                Create account
              </Link>
            </li>
            <li>
              <Link to="/cart" className="transition-colors hover:text-primary">
                Your cart
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Free delivery over $100</li>
            <li>30-day easy returns</li>
            <li>Secure checkout</li>
            <li>help@buxmart.example</li>
          </ul>
        </div>
      </div>

      <div className="border-t py-6">
        <p className="container-page text-xs text-muted-foreground">
          © {new Date().getFullYear()} BuxMart. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
