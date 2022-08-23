import { Typography } from "@mui/material";
import ModalErrorCatcher from "~/components/error-catcher/modal";
import { APIError } from "~/services/helpers/transform-response.helper";
import { useGetModifierCategoriesQuery } from "~/services/modifier-categories.service";
import { useGetProductsQuery } from "~/services/products.service";
import { DataTable } from "~/ui";
import useProductsTableHead from "./helpers/data-table-head";
import { locale } from "@monorepo/common";
import CollapsedModifiersTable from "./collapsed-modifiers-table";

export interface ProductsTableProps {}

export const ProductsTable: React.FC<ProductsTableProps> = () => {
  const head = useProductsTableHead();
  const { data: products = [], error, isLoading } = useGetProductsQuery();
  const { data: modifierCategories = [] } = useGetModifierCategoriesQuery();

  return (
    <>
      {error && <ModalErrorCatcher error={error as APIError} />}
      <DataTable
        loading={isLoading}
        head={head}
        emptyTitle="Список товаров пуст"
        emptySubTitle="Чтобы создать товар, нажмите на кнопку Добавить"
        rows={products.map(product => ({
          cols: [
            {
              name: "articleNumber",
              value: product.article_number,
            },
            {
              name: "image",
              value: product.image_url,
            },
            {
              name: "name",
              value: product.name,
            },
            {
              name: "desc",
              value: product.desc ?? "Без описания",
            },
            {
              name: "price",
              value: `${product.price} ₽`,
            },
            {
              name: "category",
              value: product.category?.name,
            },
            {
              name: "controls",
              value: product,
            },
            {
              name: "volume",
              value: product.volume
                ? `${product.volume.value} ${locale[product.volume.type]}`
                : "Не указано",
            },
            {
              name: "weight",
              value: product.weight
                ? `${product.weight.value} ${locale[product.weight.type]}`
                : "Не указано",
            },
            {
              name: "tags",
              value: product.tags?.length
                ? product.tags.join("; ")
                : "Не указаны",
            },
          ],
          collapsedRowSpace: () =>
            product.modifiers.length ? (
              <>
                <Typography variant="h6" className="ui-px-8">
                  Модификаторы
                </Typography>
                <CollapsedModifiersTable
                  modifiers={product.modifiers}
                  modifierCategories={modifierCategories}
                />
              </>
            ) : (
              <></>
            ),
        }))}
      />
    </>
  );
};

export default ProductsTable;
