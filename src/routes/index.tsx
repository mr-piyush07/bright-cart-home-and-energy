import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, ChevronLeft, ChevronRight, HeartHandshake, Leaf, Truck } from "lucide-react";
import heroImage from "@/assets/home-essentials-hero.jpg";
import { Button } from "@/components/ui/button";
import { CategoryTiles, ProductGrid, QuickView, SectionHeading, StoreFooter, StoreHeader } from "@/components/storefront";
import { toast } from "sonner";
import { products, type Product } from "@/lib/shop-service";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Good House — Everyday essentials, made better" },
    { name: "description", content: "Shop thoughtful home care, water pumps and solar essentials at Good House. Everyday quality, delivered to your door." },
    { property: "og:title", content: "Good House — Everyday essentials, made better" },
    { property: "og:description", content: "Thoughtful home essentials. Fair prices. Delivery that gets there." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: HomePage,
});

function HomePage() {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [slide, setSlide] = useState(0);
  const featured = slide === 0 ? products.slice(0, 4) : products.slice(4, 8);
  return <div className="store-enter"><StoreHeader />
    <main>
      <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-7 sm:pt-8">
        <div className="relative min-h-[440px] overflow-hidden rounded-sm bg-secondary sm:min-h-[510px] lg:min-h-[565px]">
          <img src={heroImage} alt="Everyday home essentials including solar panels, cleaning products and a water pump" width={1920} height={1120} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[61%_center]" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-transparent sm:via-background/80" />
          <div className="relative flex min-h-[440px] max-w-xl flex-col items-start justify-center px-6 py-12 sm:min-h-[510px] sm:px-12 lg:min-h-[565px] lg:px-16">
            <span className="mb-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase text-primary"><span className="size-1.5 rounded-full bg-primary" /> A little better, every day</span>
            <h1 className="max-w-lg font-display text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">Good things for <span className="text-primary">your home.</span></h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground sm:text-base">Thoughtful everyday essentials, from the laundry room to the rooftop. Picked with care, priced fairly.</p>
            <div className="mt-7 flex flex-wrap items-center gap-3"><Button asChild className="h-12 rounded-sm px-6"><Link to="/products">Shop the collection <ArrowRight size={16}/></Link></Button><Link to="/about" className="px-3 py-3 text-sm font-medium underline underline-offset-4">Get to know us</Link></div>
            <div className="mt-10 flex items-center gap-5 text-[11px] font-medium text-muted-foreground"><span className="flex items-center gap-1.5"><Truck size={15}/> Free delivery ₹999+</span><span className="size-1 rounded-full bg-border"/><span className="flex items-center gap-1.5"><BadgeCheck size={15}/> Quality checked</span></div>
          </div>
          <div className="absolute bottom-4 right-4 flex gap-2 sm:bottom-6 sm:right-6"><Button variant="secondary" size="icon" className="size-9 rounded-full" aria-label="Previous campaign" onClick={() => setSlide(0)}><ChevronLeft size={18}/></Button><Button variant="secondary" size="icon" className="size-9 rounded-full" aria-label="Next campaign" onClick={() => setSlide(1)}><ChevronRight size={18}/></Button></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-7 sm:py-20"><SectionHeading kicker="Find your everyday" title="Shop by category"/><CategoryTiles /></section>
      <section className="border-y border-border bg-card"><div className="mx-auto max-w-7xl px-4 py-14 sm:px-7 sm:py-20"><div className="flex items-end justify-between gap-4"><SectionHeading kicker="Good things, picked for you" title="Everyday favourites"/><div className="mb-7 flex shrink-0 gap-2"><Button variant="outline" size="icon" className="size-9 rounded-full" aria-label="Previous products" onClick={() => setSlide(0)}><ChevronLeft size={17}/></Button><Button variant="outline" size="icon" className="size-9 rounded-full" aria-label="Next products" onClick={() => setSlide(1)}><ChevronRight size={17}/></Button></div></div><ProductGrid items={featured} onQuickView={setActiveProduct}/><div className="mt-9 text-center"><Button asChild variant="outline" className="rounded-sm"><Link to="/products">Shop all products <ArrowRight size={15}/></Link></Button></div></div></section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:grid-cols-2 sm:items-center sm:px-7 sm:py-24">
        <div className="relative min-h-64 overflow-hidden rounded-sm bg-secondary sm:min-h-80"><img src={products[7]?.image} alt="Sunwise solar panel" loading="lazy" width={1024} height={1024} className="absolute inset-0 h-full w-full object-cover"/><span className="absolute left-4 top-4 bg-background px-3 py-1.5 text-[10px] font-semibold uppercase">A brighter idea</span></div>
        <div className="py-2 sm:px-5"><p className="text-[11px] font-semibold uppercase text-primary">Good energy, for real</p><h2 className="mt-3 max-w-lg font-display text-3xl font-semibold leading-tight sm:text-4xl">Make more of the sunshine.</h2><p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">Explore reliable solar panels and water pumps made for everyday homes. Better essentials start with better choices.</p><Button asChild className="mt-6 h-11 rounded-sm"><Link to="/products" search={{ category: "solar-panels" }}>Explore solar <ArrowRight size={16}/></Link></Button></div>
      </section>

      <section className="bg-secondary"><div className="mx-auto max-w-7xl px-4 py-14 sm:px-7 sm:py-20"><SectionHeading kicker="The good house promise" title="Little things that matter" href="/about" action="Our story"/><div className="grid gap-8 sm:grid-cols-3 sm:gap-12">{[{ icon: HeartHandshake, title: "Picked with care", text: "Everyday products chosen for quality, usefulness and value." }, { icon: Leaf, title: "A lighter footprint", text: "Thoughtful essentials that help make home a little better." }, { icon: Truck, title: "There when you need it", text: "Clear delivery, honest prices and real people ready to help." }].map(({icon: Icon,title,text})=><div key={title} className="flex gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-background text-primary"><Icon size={20}/></span><div><h3 className="font-display text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div></div>)}</div></div></section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-7 sm:py-24"><div className="mx-auto max-w-2xl text-center"><p className="text-[11px] font-semibold uppercase text-primary">A note from home</p><div className="mt-4 flex justify-center gap-1 text-primary">{Array.from({length:5},(_,i)=><Star key={i} size={16} className="fill-primary"/>)}</div><blockquote className="mt-5 font-display text-2xl font-medium leading-relaxed sm:text-3xl">“Simple to order, lovely quality, and everything arrived right on time.”</blockquote><p className="mt-4 text-sm text-muted-foreground">A happy home, Bengaluru</p></div></section>

      <section className="bg-foreground text-background"><div className="mx-auto grid max-w-7xl gap-7 px-5 py-12 sm:grid-cols-2 sm:items-center sm:px-8 sm:py-16"><div><p className="text-[11px] font-semibold uppercase text-primary">A good note now and then</p><h2 className="mt-2 font-display text-2xl font-semibold">A little good in your inbox.</h2><p className="mt-2 text-sm text-background/60">New finds, useful tips and the occasional lovely offer.</p></div><form className="flex gap-2" onSubmit={(event)=>{event.preventDefault();toast.success("You’re on the list. Look out for a good note soon!");}}><Input type="email" required placeholder="Your email address" aria-label="Email address" className="h-11 border-background/25 bg-background/10 text-background placeholder:text-background/45"/><Button className="h-11 shrink-0 rounded-sm">Sign me up</Button></form></div></section>
    </main><StoreFooter/><QuickView product={activeProduct} open={activeProduct !== null} onOpenChange={(open)=>{if(!open)setActiveProduct(null);}}/>
  </div>;
}