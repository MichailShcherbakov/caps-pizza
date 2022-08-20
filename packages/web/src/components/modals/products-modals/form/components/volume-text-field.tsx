import { SelectChangeEvent } from "@mui/material";
import React from "react";
import { ProductVolumeTypeEnum } from "~/services/products.service";
import { TextFieldWithSelect } from "~/ui";
import { locale } from "@monorepo/common";

const VOLUME_INPUT_OPTIONS = [
  {
    name: locale[ProductVolumeTypeEnum.DIAMETER],
    value: ProductVolumeTypeEnum.DIAMETER,
  },
  {
    name: locale[ProductVolumeTypeEnum.QUANTITY],
    value: ProductVolumeTypeEnum.QUANTITY,
  },
];

export interface VolumeTextFieldProps {
  volume: string;
  touched?: boolean;
  errors?: string;
  volumeType: ProductVolumeTypeEnum;
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
    volumeType = ProductVolumeTypeEnum.QUANTITY,
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
