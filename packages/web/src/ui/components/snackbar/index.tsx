import {
  Snackbar as MUISnackbar,
  SnackbarProps as MUISnackbarProps,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import useScroll from "~/hooks/use-scroll";
import { useStyle } from "./index.style";

export interface SnackbarProps extends MUISnackbarProps {
  label: string;
}

const INITIAL_START_APP_BAR_POSITION = 37;
const INITIAL_END_APP_BAR_POSITION = 110;
const SCROLLED_END_APP_BAR_POSITION = 73;
const TOP_MARGIN = 8;

export const Snackbar: React.FC<SnackbarProps> = ({ label, ...props }) => {
  const { classes } = useStyle();
  const [offset, setOffset] = React.useState(0);

  useScroll({
    onScrollChange: e => {
      if (props.open) {
        props?.onClose && props.onClose(e, "escapeKeyDown");
      }

      setOffset(
        (window.scrollY >= INITIAL_START_APP_BAR_POSITION
          ? SCROLLED_END_APP_BAR_POSITION
          : INITIAL_END_APP_BAR_POSITION - window.scrollY) + TOP_MARGIN
      );
    },
  });

  return (
    <MUISnackbar
      {...props}
      autoHideDuration={1500}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{ marginTop: `${offset}px` }}
    >
      <Stack className={classes.root}>
        <Typography color="primary">{label}</Typography>
      </Stack>
    </MUISnackbar>
  );
};

export default Snackbar;
