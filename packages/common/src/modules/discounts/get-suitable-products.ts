import { IDiscount, IProduct } from "../../interfaces";

/// 1 Product + Modifiers
/// 2 Product (any modifiers)
/// 3 Category + Modifiers
/// 4 Category (any products with any modifiers)
/// 5 Modifiers
/// 6 Order

export interface GetSuitableProductsOptions {
  strict?: boolean;
}

export function getSuitableProducts<T extends IProduct>(
  discount: IDiscount,
  products: T[],
  options: GetSuitableProductsOptions = { strict: true }
): T[] {
  return products.filter(product => {
    const modifierSet = new Set(product.modifiers.map(m => m.uuid));

    if (discount.modifiers.length) {
      if (options?.strict) {
        if (!discount.modifiers.every(m => modifierSet.has(m.uuid)))
          return false;
      } else {
        if (!discount.modifiers.some(m => modifierSet.has(m.uuid)))
          return false;
      }
    }

    if (discount.product_categories.length) {
      const passed = discount.product_categories.some(productCategory => {
        if (productCategory.category_uuid !== product.category_uuid)
          return false;

        if (options?.strict) {
          if (!productCategory.modifiers.every(m => modifierSet.has(m.uuid)))
            return false;
        } else {
          if (!productCategory.modifiers.some(m => modifierSet.has(m.uuid)))
            return false;
        }

        return true;
      });

      if (!passed) return false;
    }

    if (discount.products.length) {
      const passed = discount.products.some(p => {
        if (p.product_uuid !== product.uuid) return false;

        if (options?.strict) {
          if (!p.modifiers.every(m => modifierSet.has(m.uuid))) return false;
        } else {
          if (!p.modifiers.some(m => modifierSet.has(m.uuid))) return false;
        }

        return true;
      });

      if (!passed) return false;
    }

    return true;
  });
}

export default getSuitableProducts;
