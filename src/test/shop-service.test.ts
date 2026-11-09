import { describe, expect, it } from "vitest";
import { calculateTotals, listProducts } from "@/lib/shop-service";

describe("storefront mock API", () => {
  it("filters detergent products and sorts by the lowest price", async () => {
    const result = await listProducts({ category: "detergent", sort: "price-low" });
    expect(result.map((product) => product.id)).toEqual(["fresh-wash-1kg", "fresh-wash-5kg"]);
  });

  it("adds a ₹49 delivery charge below ₹999 and waives it at ₹999", () => {
    expect(calculateTotals([{ price: 249, quantity: 1 }]).shipping).toBe(49);
    expect(calculateTotals([{ price: 999, quantity: 1 }]).shipping).toBe(0);
  });

  it("applies HOME10 only to orders of at least ₹999 and caps it at ₹500", () => {
    expect(calculateTotals([{ price: 899, quantity: 1 }], "HOME10").discount).toBe(0);
    expect(calculateTotals([{ price: 1998, quantity: 1 }], "HOME10").discount).toBe(200);
    expect(calculateTotals([{ price: 7499, quantity: 1 }], "HOME10").discount).toBe(500);
  });
});