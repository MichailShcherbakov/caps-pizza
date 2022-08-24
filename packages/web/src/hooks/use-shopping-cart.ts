import React from "react";
import { useGetDiscountsQuery } from "~/services/discounts.service";
import { Modifier, useGetModifiersQuery } from "~/services/modifiers.service";
import { Product, useGetProductsQuery } from "~/services/products.service";
import { OrderedProduct } from "~/store/shopping-cart.reducer";
import { calculateDiscountValue } from "@monorepo/common/modules/discounts/calculate-discount-value";
import getSuitableDiscount from "@monorepo/common/modules/discounts/get-suitable-discount";
import { useAppSelector } from "~/store/hooks";
import { IDiscount } from "@monorepo/common";

export type ShoppingCartProduct = Pick<OrderedProduct, "count"> &
  Product & { fullPrice: number };

export type ShoppingCartLoading = {
  isLoading: true;
  products: undefined;
  productsCount: undefined;
  totalCost: undefined;
  discount: undefined;
  discountValue: undefined;
};

export type ShoppingCartFulfilled = {
  isLoading: false;
  products: ShoppingCartProduct[];
  productsCount: number;
  totalCost: number;
  discount?: IDiscount;
  discountValue: number;
};

export const useShoppingCart = ():
  | ShoppingCartLoading
  | ShoppingCartFulfilled => {
  const { products: choisenProducts, isShoppingCartLoading } = useAppSelector(
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
      };

    const productMap = new Map(products.map(p => [p.uuid, p]));
    const modifierMap = new Map(modifiers.map(m => [m.uuid, m]));
    const shoppingCartProducts: ShoppingCartProduct[] = choisenProducts.map(
      product => {
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
      }
    );

    const discount = getSuitableDiscount({
      discounts,
      products: shoppingCartProducts,
    })?.discount;

    const discountValue = calculateDiscountValue({
      discounts,
      products: shoppingCartProducts,
    });

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
      discount: discount,
      discountValue: discountValue,
    };
  }, [isLoading, products, modifiers, choisenProducts, discounts]);
};

export default useShoppingCart;
