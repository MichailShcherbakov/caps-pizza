import ModifierEntity from "~/db/entities/modifier.entity";
import ProductEntity from "~/db/entities/product.entity";

export default function computeFinalOrderCostHelper(
  products: ProductEntity[],
  counts: number[],
  modifiers: ModifierEntity[][]
) {
  return products.reduce(
    (totalCost, p, idx) =>
      totalCost +
      (p.price +
        modifiers[idx].reduce(
          (totalModifiersCost, m) => totalModifiersCost + m.price,
          0
        )) *
        counts[idx],
    0
  );
}
