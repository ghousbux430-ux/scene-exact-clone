<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## BuxMart conventions

- Cart state lives in `src/lib/cart.tsx` (React context + localStorage), not the database, so guests can shop before signing in.
- Product images are bundled assets mapped by `image_key` in `src/lib/product-images.ts`; the database stores the key, never a URL.
- Product reads go through TanStack Query options in `src/lib/products.ts` using the browser client, since products are publicly readable.
