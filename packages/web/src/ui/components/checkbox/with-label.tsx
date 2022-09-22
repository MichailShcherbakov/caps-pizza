import { Checkbox, FormControlLabel } from "@mui/material";

export interface CheckboxWithLabelProps {
  id?: string;
  name?: string;
  label: string;
  checked?: boolean;
  color?: "primary" | "secondary";
  size?: "small" | "medium";
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
}

export const CheckboxWithLabel: React.FC<CheckboxWithLabelProps> = ({
  id,
  name,
  label,
  color = "secondary",
  size = "small",
  checked,
  onChange,
}) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          id={id}
          name={name}
          checked={checked}
          onChange={onChange}
          color={color}
          size={size}
        />
      }
      label={label}
    />
  );
};

export default CheckboxWithLabel;
