import React from "react";
import {
  ToggleButton as MUIToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Typography } from "@mui/material";

export interface ToggleButtonElement<T> {
  name: string;
  value: T;
}

export interface ToggleButtonProps<T> {
  value?: T;
  exclusive?: boolean;
  onChange?: (event: React.MouseEvent<HTMLElement>, newValue: T | null) => void;
  elements: ToggleButtonElement<T>[];
}

export const ToggleButton: React.FC<ToggleButtonProps<string>> = ({
  value,
  exclusive,
  elements,
  onChange = () => {},
}) => {
  return (
    <ToggleButtonGroup value={value} exclusive={exclusive} onChange={onChange}>
      {elements.map(e => (
        <MUIToggleButton key={e.value} value={e.value} color="primary">
          <Typography variant="subtitle2" color="primary" className="ui-py-1">
            {e.name}
          </Typography>
        </MUIToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default ToggleButton;
