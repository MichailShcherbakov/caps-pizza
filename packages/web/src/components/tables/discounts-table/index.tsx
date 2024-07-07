import {
  DiscountCriteriaEnum,
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
import ModalErrorCatcher from "~/components/error-catcher/modal";
import { useDiscountsTableHead } from "./helpers/data-table-head";
import { locale } from "@monorepo/common";
import { Stack, Typography } from "@mui/material";

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
        emptyTitle="Список скидок пуст"
        emptySubTitle="Чтобы создать скидку, нажмите на кнопку Добавить"
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
          collapsedRowSpace() {
            return (
              <Stack>
                <Typography variant="h6" px={2}>
                  Условия распространения
                </Typography>
                <DataTable
                  head={{
                    cols: [
                      {
                        name: "condition",
                        displayName: "Условие",
                        align: "right",
                        primary: true,
                      },
                    ],
                  }}
                  rows={discount.strategies.map(strategy => ({
                    cols: [
                      {
                        name: "condition",
                        value: `${locale[strategy.condition.criteria] ?? ""} ${
                          locale[strategy.condition.op]?.toLocaleLowerCase() ??
                          ""
                        } ${strategy.condition.value} ${
                          strategy.condition.criteria ===
                          DiscountCriteriaEnum.PRICE
                            ? "₽"
                            : strategy.condition.criteria ===
                              DiscountCriteriaEnum.COUNT
                            ? "шт."
                            : ""
                        }
                      ${
                        strategy.condition.value2
                          ? `и ${strategy.condition.value2} ${
                              strategy.condition.criteria ===
                              DiscountCriteriaEnum.PRICE
                                ? "₽"
                                : strategy.condition.criteria ===
                                  DiscountCriteriaEnum.COUNT
                                ? "шт."
                                : ""
                            }`
                          : ""
                      }`,
                      },
                    ],
                    collapsedRowSpace() {
                      return (
                        <>
                          <Typography variant="h6" px={2}>
                            Распространение
                          </Typography>
                          <DataTable
                            collapsible={false}
                            head={{
                              cols: [
                                {
                                  name: "name",
                                  displayName: "Название",
                                  primary: true,
                                },
                                {
                                  name: "category",
                                  displayName: "Категория",
                                  primary: true,
                                },
                                {
                                  name: "type",
                                  displayName: "Тип",
                                  primary: true,
                                },
                              ],
                            }}
                            rows={[
                              ...strategy.products.map(product => ({
                                cols: [
                                  {
                                    name: "name",
                                    value: product.name,
                                  },
                                  {
                                    name: "type",
                                    value: "Товар",
                                  },
                                  {
                                    name: "category",
                                    value: product.categories.map(c => productCategoriesMap.get(c.uuid)?.name).join(', '),
                                    defaultValue: "-",
                                  },
                                ],
                              })),
                              ...strategy.modifiers.map(modifier => ({
                                cols: [
                                  {
                                    name: "name",
                                    value: modifier.name,
                                  },
                                  {
                                    name: "type",
                                    value: "Модификатор",
                                  },
                                  {
                                    name: "category",
                                    value: modifierCategoriesMap.get(
                                      modifier.category_uuid
                                    )?.name,
                                    defaultValue: "-",
                                  },
                                ],
                              })),
                              ...strategy.product_categories.map(category => ({
                                cols: [
                                  {
                                    name: "name",
                                    value: category.name,
                                  },
                                  {
                                    name: "type",
                                    value: "Категория товара",
                                  },
                                  {
                                    name: "category",
                                    value: "-",
                                  },
                                ],
                              })),
                            ]}
                          />
                        </>
                      );
                    },
                  }))}
                />
              </Stack>
            );
          },
        }))}
      />
    </>
  );
};

export default DiscountsTable;
