import React from "react";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import LocationIcon from "~/assets/location.svg";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export interface DestinationSelectProps {}

export const DestinationSelect: React.FC<DestinationSelectProps> = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const onButtonClickHandler = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const onMenuItemClickHandler = () => {
    setAnchorEl(null);
  };

  const onMenuCloseHandler = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="text"
        color="secondary"
        startIcon={<LocationIcon />}
        endIcon={<KeyboardArrowDownIcon />}
        onClick={onButtonClickHandler}
      >
        <Typography variant="button">Пушкин</Typography>
      </Button>
      <Menu open={open} anchorEl={anchorEl} onClose={onMenuCloseHandler}>
        <MenuItem onClick={onMenuItemClickHandler}>Пушкин</MenuItem>
      </Menu>
    </>
  );
};

export default DestinationSelect;
