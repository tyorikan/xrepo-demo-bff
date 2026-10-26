// Shared view helpers for catalog prices.
export function formatPrice(value: number): string {
  return value.toFixed(2);
}

export function toPriceView(item: { price: number; currency?: string }) {
  return {
    displayPrice: formatPrice(item.price),
    currency: item.currency ?? "JPY",
  };
}
