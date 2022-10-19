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
        {
          uuid: "2",
          name: "Доставка и оплата",
          image_url: "/images/delivery.svg",
          display_position: data.length + 2,
        },
        {
          uuid: "3",
          name: "Контакты",
          image_url: "/images/email.svg",
          display_position: data.length + 3,
        },
      ],
      isLoading,
    };
  }, [data, isLoading]);
};

export default useProductCategories;
