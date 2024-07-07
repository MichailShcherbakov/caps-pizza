import React from "react";
import useProductCategories from "~/hooks/use-product-categories";

export const useDisplayProductCategories = () => {
  const { productCategories, isLoading: isProductCategoriesLoading } =
    useProductCategories();

    const displayProductCategories = React.useMemo(() => productCategories.filter(c => c.display), [productCategories]);

  return {
    productCategories,
    isProductCategoriesLoading,
    displayProductCategories
  }
} 
