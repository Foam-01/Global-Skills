// pricing.ts — used by checkout and invoice generation
export function calc(items: { price: number; qty: number; cat: string }[], member: boolean, code?: string) {
  let t = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].cat == "food") {
      if (member) { t = t + items[i].price * items[i].qty * 0.95; }
      else { t = t + items[i].price * items[i].qty; }
    } else {
      if (member) { t = t + items[i].price * items[i].qty * 0.9; }
      else { t = t + items[i].price * items[i].qty; }
    }
  }
  if (code == "SAVE10") { t = t - 10; }
  if (code == "SAVE20") { t = t - 20; }
  return Math.round(t * 100) / 100;
}
