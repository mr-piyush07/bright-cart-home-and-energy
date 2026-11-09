import detergentImage from "@/assets/detergent-product.jpg";
import floorCleanerImage from "@/assets/floor-cleaner-product.jpg";
import waterPumpImage from "@/assets/water-pump-product.jpg";
import solarPanelImage from "@/assets/solar-panel-product.jpg";

export type CategoryId = "detergent" | "floor-cleaner" | "water-pumps" | "solar-panels";
export type Category = { id: CategoryId; name: string; label: string; image: string; count: number };
export type Product = {
  id: string;
  name: string;
  category: CategoryId;
  categoryName: string;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  stock: number;
  brand: string;
  badge?: string;
  description: string;
  image: string;
  specs: Record<string, string>;
};
export type CartItem = { productId: string; quantity: number };
export type CheckoutInput = { fullName: string; email: string; phone: string; address: string; payment: string; coupon?: string };

export const categories: Category[] = [
  { id: "detergent", name: "Laundry care", label: "Detergent Powder", image: detergentImage, count: 2 },
  { id: "floor-cleaner", name: "A cleaner home", label: "Floor Cleaner", image: floorCleanerImage, count: 2 },
  { id: "water-pumps", name: "Made to flow", label: "Water Pumps", image: waterPumpImage, count: 2 },
  { id: "solar-panels", name: "Power your day", label: "Solar Panels", image: solarPanelImage, count: 2 },
];

export const products: Product[] = [
  { id: "fresh-wash-1kg", name: "Fresh Wash Detergent Powder · 1 kg", category: "detergent", categoryName: "Detergent Powder", price: 249, mrp: 299, rating: 4.8, reviews: 126, stock: 32, brand: "Everyday", badge: "Bestseller", description: "A fresh, easy-rinse everyday wash with a gentle floral fragrance and a clean finish.", image: detergentImage, specs: { "Net weight": "1 kg", Fragrance: "Fresh floral", "Suitable for": "Cotton & everyday fabrics", "Wash type": "Machine & hand wash" } },
  { id: "fresh-wash-5kg", name: "Fresh Wash Family Pack · 5 kg", category: "detergent", categoryName: "Detergent Powder", price: 899, mrp: 1099, rating: 4.7, reviews: 82, stock: 18, brand: "Everyday", badge: "Save 18%", description: "A generous family-size pack for brighter everyday laundry and long-lasting value.", image: detergentImage, specs: { "Net weight": "5 kg", Fragrance: "Fresh floral", "Suitable for": "Cotton & everyday fabrics", "Wash type": "Machine & hand wash" } },
  { id: "citrus-clean-1l", name: "Citrus Floor Cleaner · 1 L", category: "floor-cleaner", categoryName: "Floor Cleaner", price: 189, mrp: 229, rating: 4.9, reviews: 94, stock: 41, brand: "Everyday", badge: "Top rated", description: "A bright citrus-scented concentrate for the floors you live on every day.", image: floorCleanerImage, specs: { Volume: "1 L", Fragrance: "Citrus", "Safe for": "Tile, granite & sealed floors", Dilution: "2 capfuls in half a bucket" } },
  { id: "citrus-clean-5l", name: "Citrus Floor Cleaner · 5 L", category: "floor-cleaner", categoryName: "Floor Cleaner", price: 699, mrp: 849, rating: 4.6, reviews: 51, stock: 14, brand: "Everyday", description: "A value-sized cleaning essential for busy homes and frequently used spaces.", image: floorCleanerImage, specs: { Volume: "5 L", Fragrance: "Citrus", "Safe for": "Tile, granite & sealed floors", Dilution: "2 capfuls in half a bucket" } },
  { id: "flowpro-05hp", name: "FlowPro Domestic Water Pump · 0.5 HP", category: "water-pumps", categoryName: "Water Pumps", price: 3299, mrp: 3999, rating: 4.7, reviews: 38, stock: 12, brand: "FlowPro", badge: "Popular", description: "A dependable compact pump built for everyday water pressure around the home.", image: waterPumpImage, specs: { "Motor power": "0.5 HP", Voltage: "220–240 V", "Maximum head": "32 m", "Flow rate": "32 L/min", Warranty: "1 year" } },
  { id: "flowpro-1hp", name: "FlowPro High Lift Pump · 1 HP", category: "water-pumps", categoryName: "Water Pumps", price: 5799, mrp: 6499, rating: 4.6, reviews: 27, stock: 7, brand: "FlowPro", description: "A higher-capacity pump for homes that need a little more lift and flow.", image: waterPumpImage, specs: { "Motor power": "1 HP", Voltage: "220–240 V", "Maximum head": "48 m", "Flow rate": "48 L/min", Warranty: "2 years" } },
  { id: "sunwise-450w", name: "Sunwise Mono Solar Panel · 450 W", category: "solar-panels", categoryName: "Solar Panels", price: 7499, mrp: 8999, rating: 4.9, reviews: 44, stock: 16, brand: "Sunwise", badge: "New arrival", description: "A high-efficiency monocrystalline panel for making more of every sunny day.", image: solarPanelImage, specs: { "Rated power": "450 W", "Panel type": "Monocrystalline", Efficiency: "21.3%", Dimensions: "1908 × 1134 mm", Warranty: "12 years product" } },
  { id: "sunwise-550w", name: "Sunwise Mono Solar Panel · 550 W", category: "solar-panels", categoryName: "Solar Panels", price: 9499, mrp: 10999, rating: 4.8, reviews: 22, stock: 9, brand: "Sunwise", description: "More rated power in a single panel, made for practical residential solar installs.", image: solarPanelImage, specs: { "Rated power": "550 W", "Panel type": "Monocrystalline", Efficiency: "21.6%", Dimensions: "2278 × 1134 mm", Warranty: "12 years product" } },
];

export type ProductFilters = { category?: CategoryId | "all"; query?: string; minPrice?: number; maxPrice?: number; inStock?: boolean; minRating?: number; sort?: string };
const pause = () => new Promise((resolve) => setTimeout(resolve, 90));
const CART_KEY = "good-house-cart-v1";
const WISHLIST_KEY = "good-house-wishlist-v1";
const ORDERS_KEY = "good-house-orders-v1";

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeStorage<T>(key: string, value: T) {
  if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(value));
}

export async function listProducts(filters: ProductFilters = {}) {
  await pause();
  const query = filters.query?.trim().toLowerCase() ?? "";
  const filtered = products.filter((product) =>
    (filters.category === undefined || filters.category === "all" || product.category === filters.category) &&
    (!query || `${product.name} ${product.categoryName} ${product.brand}`.toLowerCase().includes(query)) &&
    (filters.minPrice === undefined || product.price >= filters.minPrice) &&
    (filters.maxPrice === undefined || product.price <= filters.maxPrice) &&
    (!filters.inStock || product.stock > 0) &&
    (filters.minRating === undefined || product.rating >= filters.minRating),
  );
  switch (filters.sort) {
    case "price-low": filtered.sort((a, b) => a.price - b.price); break;
    case "price-high": filtered.sort((a, b) => b.price - a.price); break;
    case "rating": filtered.sort((a, b) => b.rating - a.rating); break;
    case "popular": filtered.sort((a, b) => b.reviews - a.reviews); break;
    case "newest": filtered.reverse(); break;
  }
  return filtered;
}
export async function getProduct(id: string) { await pause(); return products.find((product) => product.id === id); }
export async function getCart() { await pause(); return readStorage<CartItem[]>(CART_KEY, []); }
export async function saveCart(items: CartItem[]) { await pause(); writeStorage(CART_KEY, items); return items; }
export async function getWishlist() { await pause(); return readStorage<string[]>(WISHLIST_KEY, []); }
export async function toggleWishlist(id: string) {
  await pause();
  const current = readStorage<string[]>(WISHLIST_KEY, []);
  const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
  writeStorage(WISHLIST_KEY, next);
  return next;
}

export function calculateTotals(items: Array<{ price: number; quantity: number }>, coupon = "") {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = coupon.trim().toUpperCase() === "HOME10" && subtotal >= 999 ? Math.min(Math.round(subtotal * 0.1), 500) : 0;
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 49;
  return { subtotal, discount, shipping, total: subtotal - discount + shipping };
}

export async function simulateCheckout(input: CheckoutInput, items: CartItem[]) {
  await pause();
  if (!items.length) throw new Error("Your cart is empty.");
  const lineItems = items.map((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    if (!product || item.quantity < 1 || item.quantity > product.stock) throw new Error("Please check quantities and availability before placing your order.");
    return { product, quantity: item.quantity };
  });
  const totals = calculateTotals(lineItems.map(({ product, quantity }) => ({ price: product.price, quantity })), input.coupon);
  const order = { id: `GH-${Date.now().toString().slice(-7)}`, date: new Date().toISOString(), input, items: lineItems, totals, paymentStatus: input.payment === "Cash on delivery" ? "Pay on delivery" : "Demo payment complete" };
  const orders = readStorage<typeof order[]>(ORDERS_KEY, []);
  writeStorage(ORDERS_KEY, [order, ...orders]);
  writeStorage(CART_KEY, []);
  return order;
}