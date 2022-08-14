import {
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useMediaQuery, OptionsButton } from "~/ui";

export interface DataTableControlCellProps<
  UpdateModalProps = any,
  DeleteModalProps = any
> {
  UpdateModal: React.ElementType<UpdateModalProps>;
  UpdateModalProps: UpdateModalProps;
  DeleteModal: React.ElementType<DeleteModalProps>;
  DeleteModalProps: DeleteModalProps;
}

export const DataTableControlCell: React.FC<DataTableControlCellProps> = ({
  UpdateModal,
  UpdateModalProps,
  DeleteModal,
  DeleteModalProps,
}) => {
  const matches = useMediaQuery(theme => theme.breakpoints.down("md"));

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={1}
    >
      {matches ? (
        <OptionsButton>
          {({ close }) => [
            <UpdateModal
              {...UpdateModalProps}
              key={1}
              onSubmit={close}
              onClose={close}
            >
              {({ open }) => (
                <MenuItem onClick={open}>
                  <ListItemIcon>
                    <EditOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Изменить</ListItemText>
                </MenuItem>
              )}
            </UpdateModal>,
            <DeleteModal
              {...DeleteModalProps}
              key={2}
              onAccept={close}
              onClose={close}
            >
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
          <UpdateModal {...UpdateModalProps}>
            {({ open }) => (
              <IconButton color="warning" onClick={open}>
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            )}
          </UpdateModal>
          <DeleteModal {...DeleteModalProps}>
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
};

export default DataTableControlCell;
