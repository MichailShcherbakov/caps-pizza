import { Button, Stack, TableCell, TableRow } from "@mui/material";
import React from "react";
import WarnDeletingNotificationModal from "~/common/components/notifications/modals/warn-deleting.notification";
import { ProductCategory } from "~/services/product-categories.service";
import { useDeleteProductCategoryMutation } from "~/services/product-categories.service";
import { ExternalSvg } from "~/ui";
import UpdateProductCategoryModal from "./modals/update-product-category.modal";

export interface ProductCategoriesTableRowProps {
  category: ProductCategory;
}

export const ProductCategoriesTableRow: React.FC<ProductCategoriesTableRowProps> =
  React.memo(({ category }) => {
    const [deleteProductCategory] = useDeleteProductCategoryMutation();

    const deleteController = React.useCallback(
      ({ open }) => (
        <Button variant="outlined" color="error" size="small" onClick={open}>
          Удалить
        </Button>
      ),
      []
    );

    return (
      <TableRow>
        <TableCell>{category.uuid}</TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" justifyContent="flex-end">
            <ExternalSvg
              src={`${process.env.NEXT_PUBLIC_IMAGES_SOURCE_URL}${category.image_url}`}
              className="ui-w-12 ui-h-12"
            />
          </Stack>
        </TableCell>
        <TableCell align="right">{category.name}</TableCell>
        <TableCell align="right">
          {category.display_position ?? "Не указано"}
        </TableCell>
        <TableCell>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
            <UpdateProductCategoryModal category={category} />
            <WarnDeletingNotificationModal
              title="Удаление категории товаров необратимо"
              desc="Все прикрепленные к этой категории товары будут автоматически удалены"
              onAccept={() => deleteProductCategory({ uuid: category.uuid })}
            >
              {deleteController}
            </WarnDeletingNotificationModal>
          </Stack>
        </TableCell>
      </TableRow>
    );
  });

export default ProductCategoriesTableRow;
