import React from "react";
import { useGetDiscountsQuery } from "~/services/discounts.service";
import { Modifier, useGetModifiersQuery } from "~/services/modifiers.service";
import { Product, useGetProductsQuery } from "~/services/products.service";
import { OrderedProduct } from "~/store/shopping-cart.reducer";
import { calculateDiscountValue } from "@monorepo/common/modules/discounts/calculate-discount-value";
import getSuitableDiscount from "@monorepo/common/modules/discounts/get-suitable-discount";
import { useAppSelector } from "~/store/hooks";

export type ShoppingCartProduct = Pick<OrderedProduct, "count"> &
  Product & { fullPrice: number };

export const useShoppingCart = () => {
  const { products: choisenProducts } = useAppSelector(store => ({
    products: store.shoppingCart.products,
  }));
  const { data: products = [] } = useGetProductsQuery();
  const { data: modifiers = [] } = useGetModifiersQuery();
  const { data: discounts = [] } = useGetDiscountsQuery();

  const productMap = React.useMemo(
    () => new Map(products.map(p => [p.uuid, p])),
    [products]
  );
  const modifierMap = React.useMemo(
    () => new Map(modifiers.map(m => [m.uuid, m])),
    [modifiers]
  );

  const shoppingCartProducts: ShoppingCartProduct[] = React.useMemo(
    () =>
      choisenProducts.map(product => {
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
            foundProduct.price +
            foundModifiers.reduce((p, m) => p + m.price, 0),
        };
      }),
    [productMap, modifierMap, choisenProducts]
  );

  const discount = React.useMemo(
    () =>
      getSuitableDiscount({
        discounts,
        products: shoppingCartProducts,
      })?.discount,
    [discounts, shoppingCartProducts]
  );

  const discountValue = React.useMemo(
    () =>
      calculateDiscountValue({
        discounts,
        products: shoppingCartProducts,
      }),
    [discounts, shoppingCartProducts]
  );

  const totalCost = React.useMemo(
    () =>
      shoppingCartProducts.reduce(
        (cost, product) => cost + product.fullPrice * product.count,
        -discountValue
      ),
    [shoppingCartProducts, discountValue]
  );

  return React.useMemo(
    () => ({
      products: shoppingCartProducts,
      totalCost: totalCost,
      discount,
      discountValue,
    }),
    [shoppingCartProducts, totalCost, discount, discountValue]
  );
};

export default useShoppingCart;
