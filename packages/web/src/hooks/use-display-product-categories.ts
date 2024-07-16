import React from "react";
import useProductCategories from "~/hooks/use-product-categories";
import isNil from "lodash/isNil";

export const useDisplayProductCategories = () => {
  const { productCategories, isLoading: isProductCategoriesLoading } =
    useProductCategories();

  const displayProductCategories = React.useMemo(
    () =>
      productCategories
        .filter(c => c.display)
        .sort((a, b) => {
          if (isNil(a.parent_uuid) && isNil(b.parent_uuid)) {
            return (a.display_position ?? 0) - (b.display_position ?? 0);
          }

          if (isNil(a.parent_uuid) && !isNil(b.parent_uuid)) {
            return (
              (a.display_position ?? 0) - (b.parent?.display_position ?? 0)
            );
          }

          if (!isNil(a.parent_uuid) && isNil(b.parent_uuid)) {
            return (
              (a.parent?.display_position ?? 0) - (b.display_position ?? 0)
            );
          }

          return (
            (a.parent?.display_position ?? 0) -
              (b.parent?.display_position ?? 0) ||
            (a.display_position ?? 0) - (b.display_position ?? 0)
          );
        }),
    [productCategories]
  );

  return {
    productCategories,
    isProductCategoriesLoading,
    displayProductCategories,
  };
};
