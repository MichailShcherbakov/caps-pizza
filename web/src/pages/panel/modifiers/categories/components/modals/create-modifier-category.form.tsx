import React from "react";
import { useFormik } from "formik";
import { Stack, TextField } from "@mui/material";
import UiKit, { FormModalProps } from "~/ui";
import { ModifierCategory } from "~/services/modifier-categories.service";
import validationSchema from "../helpers/validation-schema";

export interface CreateModifierCategoryFormProps
  extends Omit<FormModalProps, "title" | "onSubmit"> {
  onSubmit?: (data: Omit<ModifierCategory, "uuid">) => void;
}

export default function CreateModifierCategoryForm(
  props: CreateModifierCategoryFormProps
) {
  const formik = useFormik({
    initialValues: {
      name: "",
      display_position: "",
    },
    validationSchema,
    onSubmit: value => {
      props.onSubmit &&
        props.onSubmit({
          name: value.name,
          display_position:
            Number.parseInt(value.display_position) ?? undefined,
        });
    },
  });

  return (
    <UiKit.FormModal
      {...props}
      title="Создание нового типа модификаторов"
      onSubmit={formik.handleSubmit}
      onCancel={props.onClose}
    >
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          required
          id="name"
          name="name"
          label="Введите название типа модификатора"
          value={formik.values.name}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          size="small"
          color="secondary"
          onChange={formik.handleChange}
        />
        <TextField
          id="display_position"
          name="display_position"
          label="Введите позицию"
          type="number"
          value={formik.values.display_position}
          error={
            formik.touched.display_position &&
            Boolean(formik.errors.display_position)
          }
          helperText={
            formik.touched.display_position && formik.errors.display_position
          }
          size="small"
          color="secondary"
          onChange={formik.handleChange}
        />
      </Stack>
    </UiKit.FormModal>
  );
}
