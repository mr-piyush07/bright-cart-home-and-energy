import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid, StoreFooter, StoreHeader, useStore } from "@/components/storefront";
import { products } from "@/lib/shop-service";

export const Route = createFileRoute("/wishlist")({ head: () => ({ meta: [{title:"Your wishlist — Good House"},{name:"description",content:"Your saved Good House home essentials."},{property:"og:title",content:"Your wishlist — Good House"},{property:"og:description",content:"The things you’ve saved for home."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}] }), component: WishlistPage });
function WishlistPage() {
  const { wishlist } = useStore();
  const saved = products.filter((item)=>wishlist.includes(item.id));
  return <div><StoreHeader/><main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-12 sm:px-7 sm:py-16"><p className="text-[11px] font-semibold uppercase text-primary">Keep the good things close</p><h1 className="mt-2 font-display text-3xl font-semibold">Your wishlist <span className="text-base font-normal text-muted-foreground">({saved.length})</span></h1>{saved.length ? <div className="mt-8"><ProductGrid items={saved}/></div> : <div className="grid min-h-80 place-items-center text-center"><div><span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary"><Heart className="text-primary"/></span><h2 className="mt-5 font-display text-xl font-semibold">A little room for something lovely</h2><p className="mt-2 text-sm text-muted-foreground">Save your favourites here while you look around.</p><Button asChild className="mt-5"><Link to="/products" search={{ category: undefined, q: undefined }}>Find your favourites <ArrowRight size={15}/></Link></Button></div></div>}</main><StoreFooter/></div>;
}