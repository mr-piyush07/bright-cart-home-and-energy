import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductGrid, QuickView, SectionHeading, StoreFooter, StoreHeader } from "@/components/storefront";
import { categories, listProducts, products, type CategoryId, type Product } from "@/lib/shop-service";

export const Route = createFileRoute("/products")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === "string" ? search.category : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  head: () => ({ meta: [
    { title: "Shop all home essentials — Good House" },
    { name: "description", content: "Browse detergents, floor cleaners, water pumps and solar panels at Good House." },
    { property: "og:title", content: "Shop all home essentials — Good House" },
    { property: "og:description", content: "Everyday essentials, thoughtfully picked for your home." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ProductsPage,
});

function ProductsPage() {
  const search = Route.useSearch();
  const selectedCategory = categories.some((item) => item.id === search.category) ? search.category as CategoryId : "all";
  const [query, setQuery] = useState(search.q ?? "");
  const [maxPrice, setMaxPrice] = useState(12000);
  const [ratingOnly, setRatingOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("popular");
  const [items, setItems] = useState<Product[]>(products);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  useEffect(() => { setQuery(search.q ?? ""); }, [search.q]);
  useEffect(() => {
    let alive = true;
    void listProducts({ category: selectedCategory, query, maxPrice, minRating: ratingOnly ? 4.5 : undefined, inStock: inStockOnly, sort }).then((result) => { if (alive) setItems(result); });
    return () => { alive = false; };
  }, [selectedCategory, query, maxPrice, ratingOnly, inStockOnly, sort]);
  const activeLabel = selectedCategory === "all" ? "All essentials" : categories.find((item) => item.id === selectedCategory)?.label ?? "All essentials";
  const anyFilter = query || selectedCategory !== "all" || maxPrice < 12000 || ratingOnly || inStockOnly;
  const resetFilters = () => { setQuery(""); setMaxPrice(12000); setRatingOnly(false); setInStockOnly(false); };
  const filterControls = <div className="grid gap-6">
    <div><h3 className="text-sm font-semibold">Category</h3><div className="mt-3 grid gap-2.5 text-sm"><Link to="/products" search={{ category: undefined, q: search.q }} className={selectedCategory === "all" ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground"}>All categories</Link>{categories.map((item)=><Link key={item.id} to="/products" search={{ category: item.id, q: search.q }} className={selectedCategory === item.id ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground"}>{item.label} <span className="text-xs">({item.count})</span></Link>)}</div></div>
    <div><div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Price range</h3><span className="text-xs text-muted-foreground">Up to ₹{maxPrice.toLocaleString("en-IN")}</span></div><input aria-label="Maximum price" type="range" min="100" max="12000" step="100" value={maxPrice} onChange={(event)=>setMaxPrice(Number(event.target.value))} className="mt-4 w-full accent-primary"/><div className="mt-1 flex justify-between text-[11px] text-muted-foreground"><span>₹100</span><span>₹12,000</span></div></div>
    <div><h3 className="text-sm font-semibold">Refine by</h3><label className="mt-3 flex items-center gap-2.5 text-sm"><Checkbox checked={inStockOnly} onCheckedChange={(checked)=>setInStockOnly(checked === true)}/> In stock only</label><label className="mt-3 flex items-center gap-2.5 text-sm"><Checkbox checked={ratingOnly} onCheckedChange={(checked)=>setRatingOnly(checked === true)}/> Rated 4.5 & up</label></div>
    {anyFilter && <Button variant="ghost" onClick={resetFilters} className="justify-start px-0 text-sm text-muted-foreground"><X size={15}/> Clear filters</Button>}
  </div>;
  return <div className="store-enter"><StoreHeader/><main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-8 sm:px-7 sm:py-12">
    <div className="mb-9 border-b border-border pb-7"><div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground"><Link to="/" className="hover:text-foreground">Home</Link><span>/</span><span>Shop</span></div><div className="flex items-end justify-between gap-4"><div><p className="text-[11px] font-semibold uppercase text-primary">The good stuff</p><h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{activeLabel}</h1><p className="mt-2 text-sm text-muted-foreground">The little things that make a home work better.</p></div><span className="pb-1 text-xs text-muted-foreground">{items.length} items</span></div>
      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">{[{id:"all", label:"Everything"}, ...categories.map(({id,label})=>({id,label}))].map(({id,label})=><Link key={id} to="/products" search={{category:id === "all" ? undefined : id, q:search.q}} className={`shrink-0 rounded-full border px-4 py-2 text-xs transition-colors ${selectedCategory === id ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}>{label}</Link>)}</div>
    </div>
    <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between"><div className="flex min-w-0 items-center gap-2"><div className="relative min-w-0 flex-1 sm:w-64 sm:flex-none"><Input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search products" aria-label="Search products" className="h-10 pr-8"/>{query && <Button variant="ghost" size="icon" className="absolute right-1 top-1 size-8" aria-label="Clear search" onClick={()=>setQuery("")}><X size={15}/></Button>}</div><Button variant="outline" className="h-10 shrink-0 sm:hidden" onClick={()=>setFiltersOpen(!filtersOpen)}><SlidersHorizontal size={15}/> Filters</Button></div><div className="flex items-center justify-end gap-2"><span className="hidden text-xs text-muted-foreground sm:block">Sort by</span><Select value={sort} onValueChange={(value)=>setSort(value)}><SelectTrigger className="h-10 w-40"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="popular">Popularity</SelectItem><SelectItem value="newest">Newest first</SelectItem><SelectItem value="price-low">Price: low to high</SelectItem><SelectItem value="price-high">Price: high to low</SelectItem><SelectItem value="rating">Highest rated</SelectItem></SelectContent></Select></div></div>
    <div className="grid gap-8 lg:grid-cols-[190px_minmax(0,1fr)]"><aside className={`${filtersOpen ? "block" : "hidden"} lg:block`}><div className="border-b border-border pb-7">{filterControls}</div></aside><section><div className="mb-5 flex items-center justify-between text-xs text-muted-foreground"><span>Showing {items.length} of {products.length} essentials</span>{anyFilter && <button className="underline underline-offset-4" onClick={resetFilters}>Clear all</button>}</div>{items.length ? <ProductGrid items={items} onQuickView={setActiveProduct}/> : <div className="grid min-h-64 place-items-center text-center"><div><p className="font-display text-xl font-semibold">Nothing here just yet</p><p className="mt-2 text-sm text-muted-foreground">Try a different search or loosen the filters.</p><Button variant="outline" className="mt-4" onClick={resetFilters}>Clear filters <ArrowRight size={15}/></Button></div></div>}</section></div>
  </main><StoreFooter/><QuickView product={activeProduct} open={activeProduct !== null} onOpenChange={(open)=>{if(!open)setActiveProduct(null);}}/></div>;
}