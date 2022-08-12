import { Button, Stack, TableCell, TableRow } from "@mui/material";
import React from "react";
import WarnDeletingNotificationModal from "~/common/components/notifications/modals/warn-deleting.notification";
import {
  ModifierCategory,
  useDeleteModifierCategoryMutation,
} from "~/services/modifier-categories.service";
import UpdateModifierCategoryModal from "./modals/update-modifier-category.modal";

export interface ModifierCategoriesTableRowProps {
  category: ModifierCategory;
}

export const ModifierCategoriesTableRow: React.FC<ModifierCategoriesTableRowProps> =
  React.memo(({ category }) => {
    const [deleteModifierCategory] = useDeleteModifierCategoryMutation();

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
        <TableCell align="right">{category.name}</TableCell>
        <TableCell align="right">
          {category.display_position ?? "Не указано"}
        </TableCell>
        <TableCell align="right">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
            <UpdateModifierCategoryModal category={category} />
            <WarnDeletingNotificationModal
              title="Удаление типа модификаторов необратимо"
              desc="Все прикрепленные к этому типу модификаторы будут удалены"
              onAccept={() => deleteModifierCategory({ uuid: category.uuid })}
            >
              {deleteController}
            </WarnDeletingNotificationModal>
          </Stack>
        </TableCell>
      </TableRow>
    );
  });

ModifierCategoriesTableRow.displayName = "ModifierCategoriesTableRow";

export default ModifierCategoriesTableRow;
