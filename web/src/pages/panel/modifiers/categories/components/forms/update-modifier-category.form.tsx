import React from "react";
import { useFormik } from "formik";
import { Stack } from "@mui/material";
import {
  MemoTextField,
  ModalContent,
  ModalControl,
  ModalFooter,
  ModalHeader,
} from "~/ui";
import { ModifierCategory } from "~/services/modifier-categories.service";
import validationSchema from "../helpers/validation-schema";

export type UpdateModifierCategoryFormSubmitData = Omit<
  ModifierCategory,
  "uuid"
>;

export interface UpdateModifierCategoryFormProps {
  category: ModifierCategory;
  onSubmit?: (data: UpdateModifierCategoryFormSubmitData) => void;
  onCancel?: () => void;
}

export const UpdateModifierCategoryForm: React.FC<
  UpdateModifierCategoryFormProps
> = ({ category, onSubmit, onCancel }) => {
  const formik = useFormik({
    initialValues: {
      name: category.name,
      display_position: category.display_position?.toString() ?? "",
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
    <ModalControl component="form" onSubmit={formik.handleSubmit}>
      <ModalHeader title="Изменение типа модификаторов" />
      <ModalContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          <MemoTextField
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
          <MemoTextField
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

export default UpdateModifierCategoryForm;
