import React from "react";
import { useGetProductCategoriesQuery } from "~/services/product-categories.service";

export const useProductCategories = () => {
  const { data = [], isLoading } = useGetProductCategoriesQuery();

  return React.useMemo(() => {
    return {
      productCategories: [
        {
          uuid: "1",
          name: "Акции",
          image_url: "/images/fire.svg",
          display_position: 1,
        },
        ...data,
      ],
      isLoading,
    };
  }, [data, isLoading]);
};

export default useProductCategories;
