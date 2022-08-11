import {
  Button,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import WarnDeletingNotificationModal from "~/common/components/notifications/modals/warn-deleting.notification";
import {
  Discount,
  DiscountCriteriaEnum,
  DiscountScopeEnum,
  DiscountTypeEnum,
  useDeleteDiscountMutation,
} from "~/services/discounts.service";
import { ModifierCategory } from "~/services/modifier-categories.service";
import { Modifier } from "~/services/modifiers.service";
import { ProductCategory } from "~/services/product-categories.service";
import { CollapsibleTableRow } from "~/ui";
import locale from "./helpers/locale";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import formatProductFeatures from "./helpers/format-product-features";
import UpdateDiscountModal from "./modals/update-discount.modal";

export interface DiscountsTableRowProps {
  discount: Discount;
  modifierCategories: ModifierCategory[];
  productCategories: ProductCategory[];
}

export const DiscountsTableRow: React.FC<DiscountsTableRowProps> = React.memo(
  ({ discount, productCategories, modifierCategories }) => {
    const [isCollapsed, setIsCollapsed] = React.useState<boolean>(true);
    const [deleteDiscount] = useDeleteDiscountMutation();

    const deleteController = React.useCallback(
      ({ open }) => (
        <Button variant="outlined" color="error" size="small" onClick={open}>
          Удалить
        </Button>
      ),
      []
    );

    const hasProductFeatures =
      discount.scope === DiscountScopeEnum.PRODUCT_FEATURES &&
      (discount.product_categories.length || discount.modifiers.length);

    const hasProducts =
      discount.scope === DiscountScopeEnum.PRODUCTS && discount.products.length;

    const productCategoriesMap = new Map(
      productCategories.map(c => [c.uuid, c])
    );

    const modifierCategoriesMap = new Map(
      modifierCategories.map(c => [c.uuid, c])
    );

    const productFeaturies = formatProductFeatures(
      discount.product_categories,
      discount.modifiers.map(m => ({
        ...m,
        category: modifierCategoriesMap.get(m.category_uuid),
      }))
    );

    return (
      <>
        <TableRow>
          <TableCell>
            {hasProductFeatures || hasProducts ? (
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {!isCollapsed ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>
            ) : undefined}
          </TableCell>
          <TableCell>{discount.uuid}</TableCell>
          <TableCell align="right">{discount.name}</TableCell>
          <TableCell align="right">{locale[discount.type]}</TableCell>
          <TableCell align="right">{locale[discount.scope]}</TableCell>
          <TableCell align="right">{`${
            locale[discount.condition.criteria]
          } ${locale[discount.condition.op].toLocaleLowerCase()} ${
            discount.condition.value
          } ${
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
        }`}</TableCell>
          <TableCell align="right" className="ui-ws-nowrap">{`${
            discount.value
          } ${
            discount.type === DiscountTypeEnum.PERCENT ? "%" : "₽"
          }`}</TableCell>
          <TableCell align="right">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={2}
            >
              <UpdateDiscountModal discount={discount} />
              <WarnDeletingNotificationModal
                title="Удаление скидки необратимо"
                desc="Вы точно хотите удалить скидку"
                onAccept={() => deleteDiscount({ uuid: discount.uuid })}
              >
                {deleteController}
              </WarnDeletingNotificationModal>
            </Stack>
          </TableCell>
        </TableRow>
        {hasProductFeatures || hasProducts ? (
          <CollapsibleTableRow in={!isCollapsed} colSpan={8}>
            {hasProductFeatures ? (
              <>
                <Typography className="ui-px-8">Элементы товаров</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>UUID</TableCell>
                      <TableCell align="right">Название</TableCell>
                      <TableCell align="right">Тип</TableCell>
                      <TableCell align="right">Цена</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productFeaturies.map(f => (
                      <TableRow key={f.uuid}>
                        <TableCell>{f.uuid}</TableCell>
                        <TableCell align="right">{f.name}</TableCell>
                        <TableCell align="right">{f._type}</TableCell>
                        <TableCell align="right">
                          {(f as Modifier)?.price ?? "Нет"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            ) : undefined}
            {hasProducts ? (
              <>
                <Typography className="ui-px-8">Товары</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>UUID</TableCell>
                      <TableCell align="right">Название</TableCell>
                      <TableCell align="right">Категория</TableCell>
                      <TableCell align="right">Цена</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {discount.products.map(p => (
                      <TableRow key={p.uuid}>
                        <TableCell>{p.uuid}</TableCell>
                        <TableCell align="right">{p.name}</TableCell>
                        <TableCell align="right">
                          {productCategoriesMap.get(p.category_uuid)?.name ??
                            "Нет информации"}
                        </TableCell>
                        <TableCell align="right">{p.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            ) : undefined}
          </CollapsibleTableRow>
        ) : undefined}
      </>
    );
  }
);

DiscountsTableRow.displayName = "DiscountsTableRow";

export default DiscountsTableRow;
