import {
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useMediaQuery, OptionsButton, ModalControllerHandle } from "~/ui";

export interface ControlAction {
  children: ModalControllerHandle;
}

export interface DataTableControlCellProps<T, T2> {
  UpdateModal: React.JSXElementConstructor<T>;
  UpdateModalProps: Omit<T, "children" | "onClose">;
  DeleteModal: React.JSXElementConstructor<T2>;
  DeleteModalProps: Omit<T2, "children" | "onClose">;
}

export function DataTableControlCell<
  T extends ControlAction,
  T2 extends ControlAction
>({
  UpdateModal,
  UpdateModalProps,
  DeleteModal,
  DeleteModalProps,
}: DataTableControlCellProps<T, T2>) {
  const matches = useMediaQuery(theme => theme.breakpoints.down("md"));

  return (
    <Stack
      width="100%"
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={1}
    >
      {matches ? (
        <OptionsButton>
          {({ close }) => [
            <UpdateModal {...(UpdateModalProps as T)} key={1} onClose={close}>
              {({ open }) => (
                <MenuItem onClick={open}>
                  <ListItemIcon>
                    <EditOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Изменить</ListItemText>
                </MenuItem>
              )}
            </UpdateModal>,
            <DeleteModal {...(DeleteModalProps as T2)} key={2} onClose={close}>
              {({ open }) => (
                <MenuItem onClick={open}>
                  <ListItemIcon>
                    <DeleteOutlineIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Удалить</ListItemText>
                </MenuItem>
              )}
            </DeleteModal>,
          ]}
        </OptionsButton>
      ) : (
        <>
          <UpdateModal {...(UpdateModalProps as T)}>
            {({ open }) => (
              <IconButton color="warning" onClick={open}>
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            )}
          </UpdateModal>
          <DeleteModal {...(DeleteModalProps as T2)}>
            {({ open }) => (
              <IconButton color="error" onClick={open}>
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            )}
          </DeleteModal>
        </>
      )}
    </Stack>
  );
}

export default DataTableControlCell;
