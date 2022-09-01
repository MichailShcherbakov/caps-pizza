import React from "react";
import { ProductCategory } from "~/services/product-categories.service";
import { DataTableControlCell, DataTableHead } from "~/ui";
import DeleteProductCategoryModal from "../delete-product-category.modal";
import UpdateProductCategoryModal from "../update-product-category.modal";

export const useProductCategoriesTableHead = () =>
  React.useMemo<DataTableHead>(
    () => ({
      cols: [
        {
          name: "image",
          type: "image",
          displayName: "Изображение",
          imageWidth: 32,
          imageHeight: 32,
          primary: true,
        },
        {
          name: "name",
          displayName: "Название",
          primary: true,
        },
        {
          name: "position",
          displayName: "Позиция",
        },
        {
          name: "controls",
          type: "component",
          displayName: "",
          primary: true,
          headColClassName: "ui-flex-center",
          component: category => (
            <DataTableControlCell
              UpdateModal={UpdateProductCategoryModal}
              UpdateModalProps={{
                category: category as ProductCategory,
              }}
              DeleteModal={DeleteProductCategoryModal}
              DeleteModalProps={{
                category: category as ProductCategory,
              }}
            />
          ),
        },
      ],
    }),
    []
  );

export default useProductCategoriesTableHead;
