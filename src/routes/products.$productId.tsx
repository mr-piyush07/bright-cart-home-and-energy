import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Heart, Minus, Plus, ShieldCheck, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid, SectionHeading, StoreFooter, StoreHeader, useStore } from "@/components/storefront";
import { products } from "@/lib/shop-service";

export const Route = createFileRoute("/products/$productId")({
  head: ({ params }) => {
    const product = products.find((item) => item.id === params.productId);
    const title = product ? `${product.name} — Good House` : "Product details — Good House";
    const description = product?.description ?? "Thoughtful everyday essentials for your home.";
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "product" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  component: ProductPage,
});

function ProductPage() {
  const { productId } = Route.useParams();
  const product = products.find((item) => item.id === productId);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, wishlist, toggleFavorite } = useStore();
  if (!product) return <div className="min-h-screen"><StoreHeader/><div className="mx-auto max-w-7xl px-5 py-24 text-center"><h1 className="font-display text-3xl font-semibold">We couldn’t find that product</h1><Button asChild className="mt-5"><Link to="/products">Browse everything</Link></Button></div><StoreFooter/></div>;
  const discount = Math.round((1 - product.price / product.mrp) * 100);
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  return <div className="store-enter"><StoreHeader/><main className="mx-auto max-w-7xl px-4 py-8 sm:px-7 sm:py-12"><div className="mb-7 flex items-center gap-2 text-xs text-muted-foreground"><Link to="/products" className="flex items-center gap-1 hover:text-foreground"><ArrowLeft size={14}/> Back to shop</Link><span>/</span><span>{product.categoryName}</span></div><div className="grid gap-9 lg:grid-cols-2 lg:gap-16"><div className="overflow-hidden rounded-sm bg-secondary"><img src={product.image} alt={product.name} width={1024} height={1024} className="aspect-square w-full object-cover"/></div><div className="flex flex-col justify-center py-3"><p className="text-xs font-semibold uppercase text-primary">{product.categoryName}</p><h1 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">{product.name}</h1><div className="mt-4 flex items-center gap-2 text-sm"><span className="flex items-center gap-1"><Star size={15} className="fill-foreground"/>{product.rating}</span><span className="text-muted-foreground">({product.reviews} reviews)</span><span className="mx-1 text-border">|</span><span className="text-xs text-muted-foreground">{product.stock > 0 ? "In stock, ready to ship" : "Currently unavailable"}</span></div><div className="mt-6 flex items-baseline gap-3"><span className="text-2xl font-semibold">₹{product.price.toLocaleString("en-IN")}</span><span className="text-base text-muted-foreground line-through">₹{product.mrp.toLocaleString("en-IN")}</span><span className="bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">SAVE {discount}%</span></div><p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground">{product.description}</p><div className="mt-7 border-y border-border py-5"><h2 className="text-sm font-semibold">Product details</h2><dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3">{Object.entries(product.specs).map(([key,value])=><div key={key}><dt className="text-[11px] text-muted-foreground">{key}</dt><dd className="mt-0.5 text-sm font-medium">{value}</dd></div>)}</dl></div><div className="mt-6 flex items-center gap-3"><div className="inline-flex h-11 items-center border border-border"><Button variant="ghost" size="icon" className="size-10 rounded-none" aria-label="Decrease quantity" onClick={()=>setQuantity(Math.max(1,quantity-1))}><Minus size={15}/></Button><span className="w-8 text-center text-sm">{quantity}</span><Button variant="ghost" size="icon" className="size-10 rounded-none" aria-label="Increase quantity" onClick={()=>setQuantity(Math.min(product.stock,quantity+1))}><Plus size={15}/></Button></div><Button className="h-11 flex-1 rounded-sm" disabled={!product.stock} onClick={()=>addToCart(product.id,quantity)}>Add to bag · ₹{(product.price*quantity).toLocaleString("en-IN")}</Button><Button variant="outline" size="icon" className="size-11 rounded-sm" aria-label="Add to wishlist" onClick={()=>toggleFavorite(product.id)}><Heart className={wishlist.includes(product.id) ? "fill-primary text-primary" : ""}/></Button></div><div className="mt-5 grid gap-3 text-xs text-muted-foreground sm:grid-cols-2"><p className="flex items-center gap-2"><Truck size={15}/> Free delivery over ₹999</p><p className="flex items-center gap-2"><ShieldCheck size={15}/> Quality checked, always</p></div><Link to="/contact" className="mt-5 flex items-center gap-1 text-sm underline underline-offset-4">Need a hand? Talk to us <ArrowRight size={14}/></Link></div></div>
      {related.length > 0 && <section className="mt-16 border-t border-border pt-12"><SectionHeading kicker="You might like" title="More in this collection"/><ProductGrid items={related}/></section>}
    </main><StoreFooter/></div>;
}