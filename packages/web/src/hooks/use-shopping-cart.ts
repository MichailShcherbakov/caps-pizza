import React from "react";
import { useGetDiscountsQuery } from "~/services/discounts.service";
import { Modifier, useGetModifiersQuery } from "~/services/modifiers.service";
import { Product, useGetProductsQuery } from "~/services/products.service";
import { OrderedProduct } from "~/store/shopping-cart.reducer";
import getSuitableDiscounts, {
  ISuitableDiscount,
} from "@monorepo/common/modules/discounts/get-suitable-discounts";
import { useAppSelector } from "~/store/hooks";
import useShoppingCartActions from "./use-shopping-cart-actions";

export type ShoppingCartProduct = Pick<OrderedProduct, "count"> &
  Product & { fullPrice: number };

export type ShoppingCartLoading = {
  isLoading: true;
  products: undefined;
  productsCount: undefined;
  totalCost: undefined;
  discounts: [];
};

export type ShoppingCartFulfilled = {
  isLoading: false;
  products: ShoppingCartProduct[];
  productsCount: number;
  totalCost: number;
  discounts: ISuitableDiscount[];
};

export const useShoppingCart = ():
  | ShoppingCartLoading
  | ShoppingCartFulfilled => {
  const { clear } = useShoppingCartActions();
  const { products: chosenProducts, isShoppingCartLoading } = useAppSelector(
    store => ({
      products: store.shoppingCart.products,
      isShoppingCartLoading: store.shoppingCart.meta.step === "pending",
    })
  );
  const { data: products = [], isLoading: isGetProductsLoading } =
    useGetProductsQuery();
  const { data: modifiers = [], isLoading: isGetModifiersLoading } =
    useGetModifiersQuery();
  const { data: discounts = [], isLoading: isGetDiscountLoading } =
    useGetDiscountsQuery();

  const isLoading =
    isShoppingCartLoading ||
    isGetProductsLoading ||
    isGetModifiersLoading ||
    isGetDiscountLoading;

  return React.useMemo(() => {
    if (isLoading)
      return {
        isLoading,
        discounts: [],
      };

    const productMap = new Map(products.map(p => [p.uuid, p]));
    const modifierMap = new Map(modifiers.map(m => [m.uuid, m]));
    const shoppingCartProducts: ShoppingCartProduct[] = [];

    for (const chosenProduct of chosenProducts) {
      const foundProduct = productMap.get(chosenProduct.uuid);

      if (!foundProduct) {
        clear();
        return {
          isLoading,
          products: [],
          productsCount: 0,
          totalCost: 0,
          discounts: [],
        };
      }

      const foundModifiers: Modifier[] = [];

      for (const chosenModifier of chosenProduct.modifiers) {
        const foundModifier = modifierMap.get(chosenModifier.uuid);

        if (!foundModifier) {
          clear();
          return {
            isLoading,
            products: [],
            productsCount: 0,
            totalCost: 0,
            discounts: [],
          };
        }

        foundModifiers.push({
          ...chosenModifier,
          ...foundModifier,
        });
      }

      shoppingCartProducts.push({
        ...chosenProduct,
        ...foundProduct,
        modifiers: foundModifiers,
        fullPrice:
          foundProduct.price + foundModifiers.reduce((p, m) => p + m.price, 0),
      });
    }

    const suitableDiscounts = getSuitableDiscounts(
      discounts,
      shoppingCartProducts
    );

    const discountValue = suitableDiscounts.reduce(
      (amount, { discountValue }) => amount + discountValue,
      0
    );

    const totalCost = shoppingCartProducts.reduce(
      (cost, product) => cost + product.fullPrice * product.count,
      -discountValue
    );

    const productsCount = shoppingCartProducts.reduce(
      (count, product) => count + product.count,
      0
    );

    return {
      isLoading: isLoading,
      products: shoppingCartProducts,
      productsCount,
      totalCost: totalCost,
      discounts: suitableDiscounts,
    };
  }, [isLoading, products, modifiers, discounts, chosenProducts, clear]);
};

export default useShoppingCart;
