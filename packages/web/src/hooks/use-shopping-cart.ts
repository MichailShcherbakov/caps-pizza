import { useGetDiscountsQuery } from "~/services/discounts.service";
import { Modifier, useGetModifiersQuery } from "~/services/modifiers.service";
import { Product, useGetProductsQuery } from "~/services/products.service";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  addProduct,
  OrderedProduct,
  removeProduct,
} from "~/store/shopping-cart.reducer";
import { calculateDiscount } from "@monorepo/common/modules/discounts/calculate-discount";

export const useShoppingCart = () => {
  const dispatch = useAppDispatch();
  const { products: choisenProducts } = useAppSelector(store => ({
    products: store.shoppingCart.products,
  }));
  const { data: products = [] } = useGetProductsQuery();
  const { data: modifiers = [] } = useGetModifiersQuery();
  const { data: discounts = [] } = useGetDiscountsQuery();

  const productMap = new Map(products.map(p => [p.uuid, p]));
  const modifierMap = new Map(modifiers.map(m => [m.uuid, m]));

  const totalCost = choisenProducts.reduce((cost, choisenProduct) => {
    const product = productMap.get(choisenProduct.uuid);

    if (!product) {
      dispatch(removeProduct({ uuid: choisenProduct.uuid }));
      return cost;
    }

    let modifiersCost = 0;

    for (const choisenProductModifier of choisenProduct.modifiers) {
      const modifier = modifierMap.get(choisenProductModifier.uuid);

      if (!modifier) {
        dispatch(removeProduct({ uuid: choisenProduct.uuid }));
        return cost;
      }

      modifiersCost += modifier.price;
    }

    return cost + (product.price + modifiersCost) * choisenProduct.count;
  }, 0);

  const discountValue = calculateDiscount({
    discounts,
    products: choisenProducts.map(product => {
      const foundProduct = productMap.get(product.uuid) as Product;
      const foundModifiers = product.modifiers.map(modifier => ({
        ...modifier,
        ...(modifierMap.get(modifier.uuid) as Modifier),
      }));

      return {
        ...product,
        ...foundProduct,
        modifiers: foundModifiers,
        fullPrice:
          foundProduct.price + foundModifiers.reduce((p, m) => p + m.price, 0),
      };
    }),
  });

  return {
    products: choisenProducts,
    totalCost: totalCost - discountValue,
    addProduct: (product: Omit<OrderedProduct, "count">) =>
      dispatch(addProduct(product)),
    removeProduct: (uuid: string) => dispatch(removeProduct({ uuid })),
  };
};

export default useShoppingCart;
