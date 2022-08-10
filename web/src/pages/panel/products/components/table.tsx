import { useGetModifierCategoriesQuery } from "~/services/modifier-categories.service";
import { useGetProductsQuery } from "~/services/products.service";
import UiKit from "~/ui";
import ProductsTableRow from "./table-row";
// import ProductsTableSkeleton from "./table.skeleton";

export interface ProductsTableProps {}

export const ProductsTable: React.FC<ProductsTableProps> = () => {
  const { data: products = [], isLoading, isError } = useGetProductsQuery();
  const { data: modifierCategories = [] } = useGetModifierCategoriesQuery();

  return isLoading || isError ? (
    <>{/* <ProductsTableSkeleton /> */}</>
  ) : (
    <UiKit.Table>
      <UiKit.TableHead>
        <UiKit.TableRow>
          <UiKit.TableTextCell></UiKit.TableTextCell>
          <UiKit.TableTextCell>UUID</UiKit.TableTextCell>
          <UiKit.TableTextCell align="right">Изображение</UiKit.TableTextCell>
          <UiKit.TableTextCell align="right">Название</UiKit.TableTextCell>
          <UiKit.TableTextCell align="right">Описание</UiKit.TableTextCell>
          <UiKit.TableTextCell align="right">Артикул</UiKit.TableTextCell>
          <UiKit.TableTextCell align="right">Цена</UiKit.TableTextCell>
          <UiKit.TableTextCell align="right">Категория</UiKit.TableTextCell>
          <UiKit.TableCell></UiKit.TableCell>
        </UiKit.TableRow>
      </UiKit.TableHead>
      <UiKit.TableBody>
        {products.map(product => (
          <ProductsTableRow
            key={product.uuid}
            product={product}
            modifierCategories={modifierCategories}
          />
        ))}
      </UiKit.TableBody>
    </UiKit.Table>
  );
};

export default ProductsTable;
