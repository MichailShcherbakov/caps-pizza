import { SelectChangeEvent } from "@mui/material";
import React from "react";
import { ProductVolumeType } from "~/services/products.service";
import { TextFieldWithSelect } from "~/ui";
import locale from "../../helpers/locale";

const VOLUME_INPUT_OPTIONS = [
  {
    name: locale[ProductVolumeType.DIAMETER],
    value: ProductVolumeType.DIAMETER,
  },
  {
    name: locale[ProductVolumeType.QUANTITY],
    value: ProductVolumeType.QUANTITY,
  },
];

export interface VolumeTextFieldProps {
  volume: string;
  touched?: boolean;
  errors?: string;
  volumeType: ProductVolumeType;
  onChange: (
    e: React.ChangeEvent | SelectChangeEvent<unknown>,
    child?: React.ReactNode
  ) => void;
}

export const VolumeTextField: React.FC<VolumeTextFieldProps> = React.memo(
  ({
    volume,
    touched,
    errors,
    volumeType = ProductVolumeType.QUANTITY,
    onChange,
  }) => {
    return (
      <TextFieldWithSelect
        TextFieldProps={{
          id: "volume",
          name: "volume",
          type: "number",
          label: "Объем",
          value: volume,
          error: touched && Boolean(errors),
          helperText: touched && errors,
          onChange,
        }}
        SelectProps={{
          id: "volumeType",
          name: "volumeType",
          label: "Тип",
          value: volumeType,
          onChange,
        }}
        options={VOLUME_INPUT_OPTIONS}
      />
    );
  }
);

VolumeTextField.displayName = "VolumeTextField";

export default VolumeTextField;
