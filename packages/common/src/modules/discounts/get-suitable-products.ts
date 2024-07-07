import { IDiscountStrategy, IProductWithFullPrice } from "../../interfaces";

/// 1 Product + Modifiers
/// 2 Product (any modifiers)
/// 3 Category + Modifiers
/// 4 Category (any products with any modifiers)
/// 5 Modifiers
/// 6 Order

export interface GetSuitableProductsOptions {
  strict?: boolean;
}

export function getSuitableProducts<T extends IProductWithFullPrice>(
  strategy: IDiscountStrategy,
  products: T[],
  options: GetSuitableProductsOptions = { strict: false }
): T[] {
  const constStrategyModifiers = strategy.modifiers.reduce(
    (p, m) => p + m.price,
    0
  );
  return products
    .filter(product => {
      if (strategy.modifiers.length) {
        const modifierSet = new Set(product.modifiers.map(m => m.uuid));

        if (options?.strict) {
          if (!strategy.modifiers.every(m => modifierSet.has(m.uuid))) {
            return false;
          }
        } else {
          if (!strategy.modifiers.some(m => modifierSet.has(m.uuid))) {
            return false;
          }
        }
      }

      if (strategy.products.length) {
        if (!strategy.products.find(p => p.uuid === product.uuid)) {
          return false;
        }
      }

      if (strategy.product_categories.length) {
        const categoriesSet = new Set(product.categories.map(c => c.uuid));

        if (options?.strict) {
          if (!strategy.product_categories.every(c => categoriesSet.has(c.uuid))) {
            return false;
          }
        } else {
          if (!strategy.product_categories.some(c => categoriesSet.has(c.uuid))) {
            return false;
          }
        }
      }

      return true;
    })
    .map(p => ({
      ...p,
      fullPrice: p.price + constStrategyModifiers,
    }));
}

export default getSuitableProducts;
