import {
  DiscountCriteriaEnum,
  DiscountScopeEnum,
  DiscountTypeEnum,
  useGetDiscountsQuery,
} from "~/services/discounts.service";
import {
  ModifierCategory,
  useGetModifierCategoriesQuery,
} from "~/services/modifier-categories.service";
import {
  ProductCategory,
  useGetProductCategoriesQuery,
} from "~/services/product-categories.service";
import { APIError } from "~/services/helpers/transform-response.helper";
import { DataTable } from "~/ui";
import ModalErrorCatcher from "~/common/components/error-catcher/modal";
import { useDiscountsTableHead } from "../helpers/data-table-head";
import locale from "../helpers/locale";
import { Typography } from "@mui/material";
import ProductFeaturesTable, { ProductFeature } from "./product-features-table";
import ProductsTable from "./products-table";

export interface DiscountsTableProps {}

export const DiscountsTable: React.FC<DiscountsTableProps> = () => {
  const head = useDiscountsTableHead();
  const { data: discounts = [], error, isLoading } = useGetDiscountsQuery();
  const { data: modifierCategories = [] as ModifierCategory[] } =
    useGetModifierCategoriesQuery();
  const { data: productCategories = [] as ProductCategory[] } =
    useGetProductCategoriesQuery();

  const productCategoriesMap = new Map(productCategories.map(c => [c.uuid, c]));

  const modifierCategoriesMap = new Map(
    modifierCategories.map(c => [c.uuid, c])
  );

  return (
    <>
      <ModalErrorCatcher error={error as APIError} />
      <DataTable
        loading={isLoading}
        head={head}
        rows={discounts.map(discount => ({
          cols: [
            {
              name: "name",
              value: discount.name,
            },
            {
              name: "type",
              value: locale[discount.type],
            },
            {
              name: "scope",
              value: locale[discount.scope],
            },
            {
              name: "condition",
              value: `${locale[discount.condition.criteria]} ${locale[
                discount.condition.op
              ].toLocaleLowerCase()} ${discount.condition.value} ${
                discount.condition.criteria === DiscountCriteriaEnum.PRICE
                  ? "₽"
                  : "шт."
              }
            ${
              discount.condition.value2
                ? `и ${discount.condition.value2} ${
                    discount.condition.criteria === DiscountCriteriaEnum.PRICE
                      ? "₽"
                      : "шт."
                  }`
                : ""
            }`,
            },
            {
              name: "value",
              value: `${discount.value} ${
                discount.type === DiscountTypeEnum.PERCENT ? "%" : "₽"
              }`,
            },
            {
              name: "controls",
              value: discount,
            },
          ],
          collapsedRowSpace: () => (
            <>
              {discount.scope === DiscountScopeEnum.PRODUCT_FEATURES ? (
                <>
                  <Typography variant="h6" className="ui-px-8">
                    Элементы товара
                  </Typography>
                  <ProductFeaturesTable
                    features={
                      [
                        ...discount.product_categories.map(category => ({
                          ...category,
                          _type: "product_category",
                        })),
                        ...discount.modifiers.map(modifier => ({
                          ...modifier,
                          category: modifierCategoriesMap.get(
                            modifier.category_uuid
                          ),
                          _type: "modifier",
                        })),
                      ] as ProductFeature[]
                    }
                  />
                </>
              ) : undefined}
              {discount.scope === DiscountScopeEnum.PRODUCTS ? (
                <>
                  <Typography variant="h6" className="ui-px-8">
                    Товары
                  </Typography>
                  <ProductsTable
                    products={discount.products.map(product => ({
                      ...product,
                      category: productCategoriesMap.get(product.category_uuid),
                    }))}
                  />
                </>
              ) : undefined}
            </>
          ),
        }))}
      />
    </>
  );
};

export default DiscountsTable;
