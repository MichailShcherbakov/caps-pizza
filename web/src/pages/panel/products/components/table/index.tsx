import { Typography } from "@mui/material";
import ModalErrorCatcher from "~/common/components/error-catcher/modal";
import { APIError } from "~/services/helpers/transform-response.helper";
import { useGetModifierCategoriesQuery } from "~/services/modifier-categories.service";
import { useGetProductsQuery } from "~/services/products.service";
import { DataTable } from "~/ui";
import useProductsTableHead from "../helpers/data-table-head";
import locale from "../helpers/locale";
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
        collapsible
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
              value: product.desc ?? "Нет",
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
              name: "weight",
              value: product.weight
                ? `${product.weight.value} ${locale[product.weight.type]}`
                : "Не указано",
            },
            {
              name: "volume",
              value: product.volume
                ? `${product.volume.value} ${locale[product.volume.type]}`
                : "Не указано",
            },
          ],
          collapsedRowSpace: () => (
            <>
              <Typography variant="h6" className="ui-px-8">
                Модификаторы
              </Typography>
              <CollapsedModifiersTable
                modifiers={product.modifiers}
                modifierCategories={modifierCategories}
              />
            </>
          ),
        }))}
      />
    </>
  );
};

export default ProductsTable;
