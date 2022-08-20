import ModalErrorCatcher from "~/components/error-catcher/modal";
import { APIError } from "~/services/helpers/transform-response.helper";
import { useGetProductCategoriesQuery } from "~/services/product-categories.service";
import { DataTable } from "~/ui";
import useProductCategoriesTableHead from "~/components/modals/product-categories-modals/helpers/data-table-head";

export interface ProductCategoriesTableProps {}

export const ProductCategoriesTable: React.FC<
  ProductCategoriesTableProps
> = () => {
  const head = useProductCategoriesTableHead();
  const {
    data: productCategories = [],
    error,
    isLoading,
  } = useGetProductCategoriesQuery();

  return (
    <>
      {error ? <ModalErrorCatcher error={error as APIError} /> : undefined}
      <DataTable
        emptyTitle="Список категорий товаров пуст"
        emptySubTitle="Чтобы создать категорию товара, нажмите на кнопку Добавить"
        head={head}
        loading={isLoading}
        rows={productCategories.map(category => ({
          cols: [
            {
              name: "image",
              value: category.image_url,
            },
            {
              name: "name",
              value: category.name,
            },
            {
              name: "position",
              value: category.display_position ?? "Не указан",
            },
            {
              name: "controls",
              value: category,
            },
          ],
        }))}
      />
    </>
  );
};

export default ProductCategoriesTable;
