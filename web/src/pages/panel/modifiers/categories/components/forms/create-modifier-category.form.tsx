import React from "react";
import { useFormik } from "formik";
import { Stack, TextField } from "@mui/material";
import { ModalContent, ModalControl, ModalFooter, ModalHeader } from "~/ui";
import { ModifierCategory } from "~/services/modifier-categories.service";
import validationSchema from "../helpers/validation-schema";

export type CreateModifierCategoryFormSubmitData = Omit<
  ModifierCategory,
  "uuid"
>;

export interface CreateModifierCategoryFormProps {
  onSubmit?: (data: CreateModifierCategoryFormSubmitData) => void;
  onCancel?: () => void;
}

export const CreateModifierCategoryForm: React.FC<
  CreateModifierCategoryFormProps
> = ({ onSubmit, onCancel }) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      display_position: "",
    },
    validationSchema,
    onSubmit: value => {
      onSubmit &&
        onSubmit({
          name: value.name,
          display_position:
            Number.parseInt(value.display_position) ?? undefined,
        });
    },
  });

  return (
    <ModalControl onSubmit={formik.handleSubmit}>
      <ModalHeader title="Создание нового типа модификаторов" />
      <ModalContent>
        <Stack direction="row" alignItems="center" spacing={2}>
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
      </ModalContent>
      <ModalFooter onCancel={onCancel} />
    </ModalControl>
  );
};

export default CreateModifierCategoryForm;
