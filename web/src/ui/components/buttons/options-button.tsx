import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu } from "@mui/material";
import React from "react";

export interface OptionsButtonProps {
  children?: (options: {
    close: () => void;
  }) => React.ReactElement | React.ReactElement[];
}

export const OptionsButton: React.FC<OptionsButtonProps> = ({ children }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="small"
        aria-label="more"
        aria-expanded={isOpen ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
      >
        {children && children({ close: handleClose })}
      </Menu>
    </>
  );
};

export default OptionsButton;
