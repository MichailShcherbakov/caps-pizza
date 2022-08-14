import React from "react";
import { DataTableHead, DataTableControlCell } from "~/ui";
import { Product } from "~/services/products.service";
import DeleteProductModal from "../modals/delete-product.modal";
import UpdateProductModal from "../modals/update-product.modal";

export const useProductsTableHead = () => {
  return React.useMemo<DataTableHead>(
    () => ({
      cols: [
        {
          name: "articleNumber",
          displayName: "Артикул",
          fullWidth: true,
        },
        {
          name: "image",
          type: "image",
          displayName: "Изображение",
          skeleton: {
            head: {
              width: 96,
            },
            row: {
              width: 72,
              height: 72,
            },
          },
        },
        {
          name: "name",
          displayName: "Название",
          primary: true,
        },
        {
          name: "desc",
          displayName: "Описание",
          fullWidth: true,
        },
        {
          name: "weight",
          displayName: "Вес",
          rowColClassName: "ui-truncate",
          collapsed: true,
        },
        {
          name: "volume",
          displayName: "Объем",
          rowColClassName: "ui-truncate",
          collapsed: true,
        },
        {
          name: "price",
          displayName: "Цена",
          rowColClassName: "ui-truncate",
          fullWidth: true,
        },
        {
          name: "category",
          displayName: "Категория",
          primary: true,
        },
        {
          name: "controls",
          type: "component",
          displayName: "",
          primary: true,
          headColClassName: "ui-flex-center",
          component: (product: Product) => (
            <DataTableControlCell
              UpdateModal={UpdateProductModal}
              UpdateModalProps={{
                product,
              }}
              DeleteModal={DeleteProductModal}
              DeleteModalProps={{
                product,
              }}
            />
          ),
        },
      ],
    }),
    []
  );
};

export default useProductsTableHead;
