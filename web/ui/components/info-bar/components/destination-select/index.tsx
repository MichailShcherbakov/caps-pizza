import React from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import LocationIcon from "~/assets/location.svg";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export interface DestinationSelectProps {}

export const DestinationSelect: React.FC<DestinationSelectProps> = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const onMenuItemClickHandle = () => {
    setAnchorEl(null);
  };

  const onMenuCloseHandle = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="text"
        color="secondary"
        startIcon={<LocationIcon />}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Пушкин
      </Button>
      <Menu open={open} anchorEl={anchorEl} onClose={onMenuCloseHandle}>
        <MenuItem onClick={onMenuItemClickHandle}>Пушкин</MenuItem>
      </Menu>
    </>
  );
};

export default DestinationSelect;
