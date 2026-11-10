import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, CircleDot, MapPin, PackageCheck, ShoppingBag, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreFooter, StoreHeader } from "@/components/storefront";
import { getLatestOrder } from "@/lib/shop-service";

export const Route = createFileRoute("/track-order")({
  head: () => ({ meta: [
    { title: "Track your order — Good House" },
    { name: "description", content: "View your latest Good House order and its simulated shipment progress." },
    { property: "og:title", content: "Track your order — Good House" },
    { property: "og:description", content: "See your latest order details and shipment progress." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: TrackOrderPage,
});

const milestones = [
  { label: "Order confirmed", description: "Your order has been received.", icon: Check },
  { label: "Preparing your order", description: "Your items are being prepared for dispatch.", icon: PackageCheck },
  { label: "On its way", description: "Your shipment is on the way to you.", icon: Truck },
  { label: "Delivered", description: "Your order has reached its destination.", icon: MapPin },
];

function TrackOrderPage() {
  const [order, setOrder] = useState<Awaited<ReturnType<typeof getLatestOrder>>>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void getLatestOrder().then((latestOrder) => {
      setOrder(latestOrder);
      setLoaded(true);
    });
  }, []);

  return <div className="store-enter"><StoreHeader/><main className="mx-auto min-h-[60vh] max-w-5xl px-4 py-10 sm:px-7 sm:py-14">
    <div className="mb-9 border-b border-border pb-7">
      <p className="text-[11px] font-semibold uppercase text-primary">Good House delivery</p>
      <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Track your order</h1>
      <p className="mt-2 text-sm text-muted-foreground">Your latest order, all in one place.</p>
    </div>

    {!loaded ? <div className="grid min-h-64 place-items-center text-sm text-muted-foreground">Loading your order…</div> : order ? <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section>
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
          <div><p className="text-xs text-muted-foreground">Order number</p><h2 className="mt-1 font-display text-xl font-semibold">{order.id}</h2><p className="mt-1 text-xs text-muted-foreground">Placed {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p></div>
          <span className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary"><CircleDot size={14}/> Order confirmed</span>
        </div>

        <div className="mt-7 border-l border-border pl-6">
          {milestones.map(({ label, description, icon: Icon }, index) => {
            const current = index === 0;
            return <div key={label} className={`relative pb-8 last:pb-0 ${current ? "text-foreground" : "text-muted-foreground"}`}>
              <span className={`absolute -left-[33px] grid size-4 place-items-center rounded-full ring-4 ring-background ${current ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{current ? <Check size={10}/> : <Icon size={10}/>}</span>
              <h3 className={`text-sm font-semibold ${current ? "text-foreground" : "text-muted-foreground"}`}>{label}</h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
            </div>;
          })}
        </div>

        <p className="mt-8 border-t border-border pt-5 text-xs leading-5 text-muted-foreground">Demo tracking only. Shipment milestones are illustrative; this storefront does not dispatch or deliver real orders.</p>
      </section>

      <aside className="h-fit border border-border p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold">Order details</h2>
        <div className="mt-4 divide-y divide-border border-y border-border">
          {order.items.map(({ product, quantity }) => <div key={product.id} className="flex gap-3 py-4">
            <img src={product.image} alt={product.name} width={64} height={64} className="size-16 shrink-0 rounded-sm bg-secondary object-cover"/>
            <div className="min-w-0 flex-1"><p className="text-sm font-medium leading-5">{product.name}</p><p className="mt-1 text-xs text-muted-foreground">Qty {quantity}</p></div>
            <span className="shrink-0 text-sm font-medium">₹{(product.price * quantity).toLocaleString("en-IN")}</span>
          </div>)}
        </div>
        <div className="mt-4 flex justify-between text-sm"><span className="text-muted-foreground">Payment</span><span className="text-right">{order.paymentStatus}</span></div>
        <div className="mt-4 flex justify-between border-t border-border pt-4 text-sm font-semibold"><span>Total</span><span>₹{order.totals.total.toLocaleString("en-IN")}</span></div>
      </aside>
    </div> : <section className="grid min-h-80 place-items-center border-y border-border py-12 text-center">
      <div><span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary"><ShoppingBag className="text-primary"/></span><h2 className="mt-5 font-display text-xl font-semibold">No orders to track yet</h2><p className="mt-2 text-sm text-muted-foreground">Your latest order will appear here after checkout.</p><Button asChild className="mt-5"><Link to="/products" search={{ category: undefined, q: undefined }}>Browse the shop <ArrowRight size={15}/></Link></Button></div>
    </section>}
  </main><StoreFooter/></div>;
}