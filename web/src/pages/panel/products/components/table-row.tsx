import React from "react";
import NextImage from "next/image";
import {
  Button,
  Collapse,
  TableRow,
  TableCell,
  TableBody,
  Table,
  Typography,
  TableHead,
  IconButton,
  Stack,
} from "@mui/material";
import WarnDeletingNotificationModal from "~/common/components/notifications/modals/warn-deleting.notification";
import { Product, useDeleteProductMutation } from "~/services/products.service";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ModifierCategory } from "~/services/modifier-categories.service";
import UpdateProductModal from "./modals/update-product.modal";

export interface ProductsTableRowProps {
  product: Product;
  modifierCategories: ModifierCategory[];
}

export const ProductsTableRow: React.FC<ProductsTableRowProps> = React.memo(
  ({ product, modifierCategories }) => {
    const [isCollapsed, setIsCollapsed] = React.useState<boolean>(true);
    const [deleteProduct] = useDeleteProductMutation();

    const modifierCategoriesMap = React.useMemo(
      () => new Map(modifierCategories.map(c => [c.uuid, c])),
      [modifierCategories]
    );

    const deleteController = React.useCallback(
      ({ open }) => (
        <Button variant="outlined" color="error" size="small" onClick={open}>
          Удалить
        </Button>
      ),
      []
    );

    return (
      <>
        <TableRow>
          <TableCell>
            {product.modifiers.length ? (
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
          <TableCell>{product.uuid}</TableCell>
          <TableCell align="right">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <NextImage
                src={`${process.env.NEXT_PUBLIC_IMAGES_SOURCE_URL}${product.image_url}`}
                width="48"
                height="48"
                alt="product image"
              />
            </Stack>
          </TableCell>
          <TableCell align="right">{product.name}</TableCell>
          <TableCell align="right">{product.desc ?? "Нет"}</TableCell>
          <TableCell align="right">{product.article_number}</TableCell>
          <TableCell align="right">{product.price}</TableCell>
          <TableCell align="right">{product.category?.name}</TableCell>
          <TableCell align="center">
            <Stack direction="row" alignItems="center" spacing={2}>
              <UpdateProductModal product={product} />
              <WarnDeletingNotificationModal
                title="Удаление товара необратимо"
                desc="Вы точно хотите удалить товар"
                onAccept={() => deleteProduct({ uuid: product.uuid })}
              >
                {deleteController}
              </WarnDeletingNotificationModal>
            </Stack>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            colSpan={9}
            className="ui-p-0"
            style={{ borderWidth: isCollapsed ? 0 : 1 }}
          >
            <Collapse in={!isCollapsed} timeout="auto" unmountOnExit>
              <Stack className="ui-py-8" spacing={2}>
                <Typography className="ui-px-8">Модификаторы</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>UUID</TableCell>
                      <TableCell align="right">Название</TableCell>
                      <TableCell align="right">Описание</TableCell>
                      <TableCell align="right">Артикул</TableCell>
                      <TableCell align="right">Цена</TableCell>
                      <TableCell align="right">Категория</TableCell>
                      <TableCell align="right">Позиция</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {product.modifiers.map(m => (
                      <TableRow
                        key={m.uuid}
                        onClick={() => setIsCollapsed(!isCollapsed)}
                      >
                        <TableCell>{m.uuid}</TableCell>
                        <TableCell align="right">{m.name}</TableCell>
                        <TableCell align="right">{m.desc ?? "Нет"}</TableCell>
                        <TableCell align="right">{m.article_number}</TableCell>
                        <TableCell align="right">{m.price}</TableCell>
                        <TableCell align="right">
                          {modifierCategoriesMap.get(m.category_uuid)?.name ??
                            "Не указано"}
                        </TableCell>
                        <TableCell align="right">
                          {m.display_position ?? "Не указано"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Stack>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }
);

ProductsTableRow.displayName = "ProductsTableRow";

export default ProductsTableRow;
