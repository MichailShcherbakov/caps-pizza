import { IProductWithFullPrice } from "interfaces";

export function computeProductCost(
  product: IProductWithFullPrice,
  options: { withCount?: boolean } = { withCount: true }
): number {
  if (options.withCount) return product.fullPrice * product.count;
  else return product.fullPrice;
}

export function computeProductsCost(
  products: IProductWithFullPrice[],
  options: { withCount?: boolean } = { withCount: true }
): number {
  return products.reduce(
    (cost, product) => cost + computeProductCost(product, options),
    0
  );
}
