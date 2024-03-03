import React from "react";
import { useGetDiscountsQuery } from "~/services/discounts.service";
import { Modifier, useGetModifiersQuery } from "~/services/modifiers.service";
import { Product, useGetProductsQuery } from "~/services/products.service";
import { OrderedProduct } from "~/store/reducers/shopping-cart.reducer";
import getSuitableDiscounts, {
  ISuitableDiscount,
} from "@monorepo/common/modules/discounts/get-suitable-discounts";
import { useAppSelector } from "~/store/hooks";
import useShoppingCartActions from "./use-shopping-cart-actions";
import { useGetDeliveriesQuery } from "~/services/delivery.service";
import getAvailableDeliveries from "@monorepo/common/modules/delivery/get-available-deliveries";
import { IDelivery } from "@monorepo/common";

export type ShoppingCartProduct = Pick<OrderedProduct, "count"> &
  Product & { fullPrice: number };

export type ShoppingCartLoading = {
  isLoading: true;
  products: ShoppingCartProduct[];
  productsCount: number;
  totalCost: number;
  totalOrderCost: number;
  discounts: ISuitableDiscount[];
  availableDeliveries: IDelivery[];
  minAvailableDelivery: undefined;
};

export type ShoppingCartFulfilled = {
  isLoading: false;
  products: ShoppingCartProduct[];
  productsCount: number;
  totalCost: number;
  totalOrderCost: number;
  discounts: ISuitableDiscount[];
  availableDeliveries: IDelivery[];
  minAvailableDelivery: IDelivery | undefined;
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
  const { data: deliveries = [], isLoading: isGetDeliveriesLoading } =
    useGetDeliveriesQuery();

  const isLoading =
    isShoppingCartLoading ||
    isGetProductsLoading ||
    isGetModifiersLoading ||
    isGetDiscountLoading ||
    isGetDeliveriesLoading;

  return React.useMemo(() => {
    if (isLoading)
      return {
        isLoading,
        discounts: [],
        products: [],
        availableDeliveries: [],
        productsCount: 0,
        totalCost: 0,
        totalOrderCost: 0,
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
          discounts: [],
          products: [],
          availableDeliveries: [],
          productsCount: 0,
          totalCost: 0,
          totalOrderCost: 0,
        };
      }

      const foundModifiers: Modifier[] = [];

      for (const chosenModifier of chosenProduct.modifiers) {
        const foundModifier = modifierMap.get(chosenModifier.uuid);

        if (!foundModifier) {
          clear();
          return {
            isLoading,
            discounts: [],
            products: [],
            availableDeliveries: [],
            productsCount: 0,
            totalCost: 0,
            totalOrderCost: 0,
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

    const availableDeliveries = getAvailableDeliveries({
      deliveries,
      orderCost: totalCost,
      orderedProductsCount: productsCount,
    });

    let minAvailableDelivery: IDelivery | undefined = availableDeliveries[0];

    availableDeliveries.forEach(d => {
      if (
        typeof minAvailableDelivery === "undefined" ||
        d.value < minAvailableDelivery.value
      ) {
        minAvailableDelivery = d;
      }
    });

    const totalOrderCost = totalCost + (minAvailableDelivery?.value ?? 0);

    return {
      isLoading,
      products: shoppingCartProducts,
      productsCount,
      totalCost,
      totalOrderCost,
      discounts: suitableDiscounts,
      availableDeliveries,
      minAvailableDelivery,
    };
  }, [
    isLoading,
    products,
    modifiers,
    discounts,
    deliveries,
    chosenProducts,
    clear,
  ]);
};

export default useShoppingCart;
