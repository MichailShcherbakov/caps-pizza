import React from "react";
import { DataTableHead, DataTableControlCell } from "~/ui";
import { Product } from "~/services/products.service";
import DeleteProductModal from "~/components/modals/products-modals/delete-product.modal";
import UpdateProductModal from "~/components/modals/products-modals/update-product.modal";

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
          imageWidth: 72,
          imageHeight: 72,
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
          name: "volume",
          displayName: "Объем",
          truncate: true,
          collapsed: true,
        },
        {
          name: "weight",
          displayName: "Вес",
          truncate: true,
          collapsed: true,
        },
        {
          name: "tags",
          displayName: "Теги",
          truncate: true,
          collapsed: true,
          fullWidth: true,
        },
        {
          name: "price",
          displayName: "Цена",
          truncate: true,
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
          component: product => (
            <DataTableControlCell
              UpdateModal={UpdateProductModal}
              UpdateModalProps={{
                product: product as Product,
              }}
              DeleteModal={DeleteProductModal}
              DeleteModalProps={{
                product: product as Product,
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
