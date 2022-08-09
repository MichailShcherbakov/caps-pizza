import React from "react";
import { Button, Stack, TableCell, TableRow } from "@mui/material";
import WarnDeletingNotificationModal from "~/common/components/notifications/modals/warn-deleting.notification";
import {
  Modifier,
  useDeleteModifierMutation,
} from "~/services/modifiers.service";
import UpdateModifierModal from "./modals/update-modifier.modal";

export interface ModifiersTableRowProps {
  modifier: Modifier;
}

export const ModifiersTableRow: React.FC<ModifiersTableRowProps> = React.memo(
  ({ modifier }) => {
    const [deleteModifier] = useDeleteModifierMutation();

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
        <TableCell>{modifier.uuid}</TableCell>
        <TableCell align="right">{modifier.name}</TableCell>
        <TableCell align="right">{modifier.desc ?? "Нет"}</TableCell>
        <TableCell align="right">{modifier.article_number}</TableCell>
        <TableCell align="right">{modifier.price}</TableCell>
        <TableCell align="right">{modifier.category?.name}</TableCell>
        <TableCell align="right">
          {modifier.display_position ?? "Не указано"}
        </TableCell>
        <TableCell>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
            <UpdateModifierModal modifier={modifier} />
            <WarnDeletingNotificationModal
              title="Удаление модификатора необратимо"
              desc="Если этот модификатор используется по умолчанию в товаре, то его удаление лешит продукта иметь других модификаторов такого же типа"
              onAccept={() => deleteModifier({ uuid: modifier.uuid })}
            >
              {deleteController}
            </WarnDeletingNotificationModal>
          </Stack>
        </TableCell>
      </TableRow>
    );
  }
);

export default ModifiersTableRow;
