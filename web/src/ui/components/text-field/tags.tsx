import React from "react";
import { Chip, Stack } from "@mui/material";
import { TextField, TextFieldProps } from "~/ui";

export interface TagsTextFieldProps
  extends Pick<TextFieldProps, "id" | "name"> {
  tags: string[];
  touched?: boolean;
  errors?: string | string[];
  TextFieldProps?: TextFieldProps;
  onChange?: (tags: string[]) => void;
}

export const TagsTextField: React.FC<TagsTextFieldProps> = React.memo(
  ({ tags, touched, errors, TextFieldProps, onChange }) => {
    const [value, setValue] = React.useState<string>("");
    return (
      <Stack>
        <TextField
          {...TextFieldProps}
          fullWidth
          label="Теги"
          value={value}
          error={touched && Boolean(errors)}
          helperText={touched && errors}
          size="small"
          color="secondary"
          onChange={e => {
            const currentValue = e.target.value;

            if (
              !currentValue.length ||
              currentValue[currentValue.length - 1] !== ";"
            ) {
              setValue(e.target.value);
              return;
            }

            const tag = currentValue.slice(0, currentValue.length - 1);

            setValue("");

            if (tags.find(t => t === tag)) return;

            onChange && onChange([...tags, tag]);
          }}
          disabled={tags.length > 4}
        />
        <Stack
          direction="row"
          alignItems="center"
          className={tags.length ? "ui-pt-8" : ""}
          spacing={1}
        >
          {tags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => {
                onChange && onChange(tags.filter(t => t !== tag));
              }}
            />
          ))}
        </Stack>
      </Stack>
    );
  }
);

TagsTextField.displayName = "TagsTextField";

export default TagsTextField;
