import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Heart, Menu, Minus, Plus, Search, ShoppingBag, Sparkles, Star, Truck, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { categories, getCart, getWishlist, products, saveCart, toggleWishlist, type CartItem, type Product } from "@/lib/shop-service";

type StoreContextValue = { cart: CartItem[]; wishlist: string[]; addToCart: (id: string, qty?: number) => void; updateQuantity: (id: string, qty: number) => void; removeFromCart: (id: string) => void; toggleFavorite: (id: string) => void };
const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  useEffect(() => { void getCart().then(setCart); void getWishlist().then(setWishlist); }, []);
  const updateCart = (next: CartItem[]) => { setCart(next); void saveCart(next); };
  const addToCart = (id: string, qty = 1) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    const current = cart.find((item) => item.productId === id)?.quantity ?? 0;
    const nextQty = Math.min(product.stock, current + qty);
    updateCart(cart.some((item) => item.productId === id) ? cart.map((item) => item.productId === id ? { ...item, quantity: nextQty } : item) : [...cart, { productId: id, quantity: nextQty }]);
    toast.success(current ? "Cart updated" : "Added to your bag", { description: product.name });
  };
  const updateQuantity = (id: string, qty: number) => {
    const product = products.find((item) => item.id === id);
    if (qty < 1) return void updateCart(cart.filter((item) => item.productId !== id));
    updateCart(cart.map((item) => item.productId === id ? { ...item, quantity: Math.min(qty, product?.stock ?? qty) } : item));
  };
  const removeFromCart = (id: string) => updateCart(cart.filter((item) => item.productId !== id));
  const toggleFavorite = (id: string) => {
    const next = wishlist.includes(id) ? wishlist.filter((item) => item !== id) : [...wishlist, id];
    setWishlist(next); void toggleWishlist(id);
    toast(next.includes(id) ? "Saved to wishlist" : "Removed from wishlist");
  };
  const value = useMemo(() => ({ cart, wishlist, addToCart, updateQuantity, removeFromCart, toggleFavorite }), [cart, wishlist]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("StoreProvider is missing.");
  return value;
}

export function StoreHeader() {
  const { cart, wishlist } = useStore();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  return <>
    <div className="bg-foreground px-4 py-2 text-center text-xs font-medium text-background"><span className="inline-flex items-center gap-2"><Truck size={14} /> Free delivery on orders over ₹999 <span className="text-background/40">·</span> MADE FOR EVERYDAY LIVING</span></div>
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:gap-8 sm:px-7">
        <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Open navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
        <Link to="/" className="flex items-center gap-2.5" aria-label="Good House home"><span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground"><Sparkles size={19} /></span><span className="font-display text-xl font-semibold leading-none tracking-normal">good<span className="text-primary">house</span><span className="ml-1 align-top text-[9px] font-medium text-muted-foreground">®</span></span></Link>
        <nav className="hidden items-center justify-center gap-7 text-sm font-medium sm:flex">
          <Link to="/products" className="transition-colors hover:text-primary" search={{ category: undefined, q: undefined }}>Shop all</Link>
          <Link to="/products" search={{ category: "detergent" , q: undefined }} className="transition-colors hover:text-primary">Home care</Link>
          <Link to="/products" search={{ category: "water-pumps" , q: undefined }} className="transition-colors hover:text-primary">Pumps & solar</Link>
          <Link to="/about" className="transition-colors hover:text-primary">Our story</Link>
        </nav>
        <div className="flex items-center justify-end gap-1">
          <form className="hidden w-40 items-center border-b border-border md:flex lg:w-52" onSubmit={(event) => { event.preventDefault(); window.location.href = `/products?q=${encodeURIComponent(search)}`; }}><Search size={16} className="shrink-0 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="h-9 border-0 bg-transparent text-sm shadow-none focus-visible:ring-0" aria-label="Search products" /></form>
          <Link to="/wishlist" className="relative grid size-10 place-items-center rounded-full transition-colors hover:bg-secondary" aria-label={`Wishlist, ${wishlist.length} items`}><Heart size={19} />{wishlist.length > 0 && <span className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">{wishlist.length}</span>}</Link>
          <Link to="/cart" className="relative grid size-10 place-items-center rounded-full transition-colors hover:bg-secondary" aria-label={`Shopping bag, ${cart.reduce((n, item) => n + item.quantity, 0)} items`}><ShoppingBag size={19} />{cart.length > 0 && <span className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">{cart.reduce((n, item) => n + item.quantity, 0)}</span>}</Link>
          <Link to="/contact" className="hidden rounded-full bg-secondary px-4 py-2 text-xs font-semibold sm:inline-flex">Get in touch</Link>
        </div>
      </div>
      {menuOpen && (
        <nav className="grid gap-1 border-t border-border px-5 py-3 sm:hidden">
          <Link to="/products" search={{ category: undefined, q: undefined }} onClick={() => setMenuOpen(false)} className="p-3">Shop all</Link>
          <Link to="/products" search={{ category: "detergent", q: undefined }} onClick={() => setMenuOpen(false)} className="p-3">Home care</Link>
          <Link to="/products" search={{ category: "water-pumps", q: undefined }} onClick={() => setMenuOpen(false)} className="p-3">Pumps &amp; solar</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="p-3">Our story</Link>
        </nav>
      )}
    </header>
  </>;
}

export function StoreFooter() {
  return <footer className="mt-20 bg-foreground text-background"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
    <div><Link to="/" className="font-display text-2xl font-semibold">good<span className="text-primary">house</span></Link><p className="mt-4 max-w-xs text-sm leading-6 text-background/65">Everyday essentials, thoughtfully picked. A little better for every home.</p></div>
    <div><p className="text-xs font-semibold uppercase tracking-normal text-background/50">Shop</p><div className="mt-4 grid gap-3 text-sm"><Link to="/products" search={{ category: undefined, q: undefined }}>All products</Link>{categories.map((category) => <Link key={category.id} to="/products" search={{ category: category.id , q: undefined }}>{category.label}</Link>)}</div></div>
    <div><p className="text-xs font-semibold uppercase tracking-normal text-background/50">Good to know</p><div className="mt-4 grid gap-3 text-sm"><Link to="/about">Our story</Link><Link to="/contact">Contact us</Link><Link to="/cart">Shipping & returns</Link></div></div>
    <div><p className="text-xs font-semibold uppercase tracking-normal text-background/50">A little note</p><p className="mt-4 text-sm leading-6 text-background/65">Thoughtful essentials. Fair prices. Delivery that gets there.</p><div className="mt-5 flex items-center gap-2 text-sm"><Check size={16} className="text-primary" /> Safe & secure checkout</div></div>
  </div><div className="border-t border-background/15 px-5 py-5 text-center text-xs text-background/50">© 2026 Good House · Everyday, made better.</div></footer>;
}

export function ProductCard({ product, onQuickView }: { product: Product; onQuickView?: (product: Product) => void }) {
  const { addToCart, wishlist, toggleFavorite } = useStore();
  const saved = wishlist.includes(product.id);
  const discount = Math.round((1 - product.price / product.mrp) * 100);
  return <article className="group min-w-0">
    <div className="relative overflow-hidden rounded-sm bg-secondary">
      <Link to="/products/$productId" params={{ productId: product.id }} aria-label={`View ${product.name}`} search={{ category: undefined, q: undefined }}><img src={product.image} alt={product.name} loading="lazy" width={1024} height={1024} className="aspect-[4/4.4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]" /></Link>
      {product.badge && <span className="absolute left-3 top-3 bg-background px-2.5 py-1 text-[10px] font-semibold uppercase tracking-normal">{product.badge}</span>}
      <span className="absolute bottom-3 left-3 rounded-sm bg-primary px-2 py-1 text-[10px] font-semibold text-primary-foreground">-{discount}%</span>
      <Button variant="secondary" size="icon" className="absolute right-3 top-3 size-9 rounded-full bg-background/90" aria-label={saved ? "Remove from wishlist" : "Add to wishlist"} onClick={() => toggleFavorite(product.id)}><Heart size={17} className={saved ? "fill-primary text-primary" : ""} /></Button>
      <Button variant="default" className="absolute bottom-3 right-3 size-10 rounded-full p-0 opacity-100 shadow-sm sm:translate-y-3 sm:opacity-0 sm:transition-all sm:group-hover:translate-y-0 sm:group-hover:opacity-100" aria-label={`Add ${product.name} to bag`} onClick={() => addToCart(product.id)}><Plus size={19} /></Button>
      {onQuickView && <button className="absolute inset-x-0 bottom-0 hidden bg-foreground/85 py-3 text-xs font-semibold text-background transition md:group-hover:block" onClick={() => onQuickView(product)}>Quick view</button>}
    </div>
    <div className="pt-3"><Link to="/products/$productId" params={{ productId: product.id }} className="line-clamp-2 text-sm font-medium leading-5 hover:text-primary" search={{ category: undefined, q: undefined }}>{product.name}</Link><div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground"><Star size={13} className="fill-foreground text-foreground" />{product.rating} <span>({product.reviews})</span><span className="ml-auto">{product.stock > 0 ? "In stock" : "Sold out"}</span></div><div className="mt-2 flex items-baseline gap-2"><span className="text-sm font-semibold">₹{product.price.toLocaleString("en-IN")}</span><span className="text-xs text-muted-foreground line-through">₹{product.mrp.toLocaleString("en-IN")}</span></div></div>
  </article>;
}

export function ProductGrid({ items, onQuickView }: { items: Product[]; onQuickView?: (product: Product) => void }) {
  return <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">{items.map((product) => <ProductCard key={product.id} product={product} {...(onQuickView ? { onQuickView } : {})} />)}</div>;
}

export function QuickView({ product, open, onOpenChange }: { product: Product | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { addToCart } = useStore();
  if (!product) return null;
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-3xl"><div className="grid gap-6 sm:grid-cols-2"><img src={product.image} alt={product.name} className="aspect-square w-full rounded-sm bg-secondary object-cover"/><div className="flex flex-col justify-center"><DialogHeader className="text-left"><p className="text-xs uppercase text-muted-foreground">{product.categoryName}</p><DialogTitle className="mt-2 font-display text-2xl">{product.name}</DialogTitle><DialogDescription className="mt-3 leading-6">{product.description}</DialogDescription></DialogHeader><p className="mt-5 text-xl font-semibold">₹{product.price.toLocaleString("en-IN")} <span className="ml-2 text-sm font-normal text-muted-foreground line-through">₹{product.mrp.toLocaleString("en-IN")}</span></p><Button className="mt-5 h-11" onClick={() => { addToCart(product.id); onOpenChange(false); }}>Add to bag <ArrowRight size={16}/></Button><Link to="/products/$productId" params={{ productId: product.id }} className="mt-4 text-center text-sm underline underline-offset-4" search={{ category: undefined, q: undefined }}>Full details</Link></div></div></DialogContent></Dialog>;
}

export function CategoryTiles() {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">{categories.map((category) => <Link key={category.id} to="/products" search={{ category: category.id , q: undefined }} className="group"><div className="overflow-hidden rounded-sm bg-secondary"><img src={category.image} alt={category.label} loading="lazy" width={1024} height={1024} className="aspect-[1/1.05] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"/></div><div className="flex items-center justify-between pt-3"><div><span className="text-[10px] uppercase text-muted-foreground">{category.name}</span><h3 className="mt-0.5 text-sm font-semibold">{category.label}</h3></div><ArrowRight size={17} className="transition-transform group-hover:translate-x-1"/></div></Link>)}</div>;
}

export function SectionHeading({ kicker, title, href = "/products", action = "Explore all" }: { kicker: string; title: string; href?: "/products" | "/about" | "/contact"; action?: string }) {
  return <div className="mb-7 flex items-end justify-between gap-3"><div><p className="text-[11px] font-semibold uppercase text-primary">{kicker}</p><h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{title}</h2></div><Link to={href} className="flex shrink-0 items-center gap-1 text-xs font-medium sm:text-sm">{action}<ArrowRight size={15}/></Link></div>;
}

export function QuantityControl({ quantity, onChange }: { quantity: number; onChange: (quantity: number) => void }) {
  return <div className="inline-flex h-9 items-center border border-border"><Button variant="ghost" size="icon" className="size-8 rounded-none" aria-label="Decrease quantity" onClick={() => onChange(quantity - 1)}><Minus size={14}/></Button><span className="w-7 text-center text-sm tabular-nums">{quantity}</span><Button variant="ghost" size="icon" className="size-8 rounded-none" aria-label="Increase quantity" onClick={() => onChange(quantity + 1)}><Plus size={14}/></Button></div>;
}