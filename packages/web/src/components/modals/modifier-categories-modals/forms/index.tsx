import React from "react";
import { useFormik } from "formik";
import { Stack } from "@mui/material";
import {
  CheckboxWithLabel,
  MemoTextField,
  ModalContent,
  ModalControl,
  ModalFooter,
  ModalHeader,
} from "~/ui";
import { ModifierCategory } from "~/services/modifier-categories.service";
import validationSchema from "../helpers/validation-schema";
import {
  ModifierCategoryChoiceOptionEnum,
  ModifierCategoryDisplayVariantEnum,
} from "@monorepo/common";
import СhoiceOptionSelect from "./choice-option-select";
import DisplayVariantSelect from "./choice-option-select copy";

export type ModifierCategoryFormSubmitData = Omit<ModifierCategory, "uuid">;

export interface ModifierCategoryFormProps {
  category?: ModifierCategory;
  onSubmit?: (data: ModifierCategoryFormSubmitData) => void;
  onCancel?: () => void;
}

export interface ModifierCategoryFormData {
  name: string;
  choice_option: ModifierCategoryChoiceOptionEnum;
  display: boolean;
  display_name: string;
  display_variant: ModifierCategoryDisplayVariantEnum;
  display_position: string;
}

export const ModifierCategoryForm: React.FC<ModifierCategoryFormProps> = ({
  category,
  onSubmit,
  onCancel,
}) => {
  const formik = useFormik<ModifierCategoryFormData>({
    initialValues: {
      name: category?.name ?? "",
      choice_option:
        category?.choice_option ?? ModifierCategoryChoiceOptionEnum.ONE,
      display: category?.display ?? true,
      display_name: category?.display_name ?? "",
      display_variant:
        category?.display_variant ?? ModifierCategoryDisplayVariantEnum.LIST,
      display_position: category?.display_position?.toString() ?? "",
    },
    validationSchema,
    onSubmit: value => {
      onSubmit &&
        onSubmit({
          name: value.name,
          choice_option: value.choice_option,
          display: value.display,
          display_name: value.display_name.length
            ? value.display_name
            : undefined,
          display_variant: value.display_variant,
          display_position:
            Number.parseInt(value.display_position) ?? undefined,
        });
    },
  });

  return (
    <ModalControl component="form" onSubmit={formik.handleSubmit}>
      <ModalHeader title="Изменение типа модификаторов" />
      <ModalContent>
        <Stack spacing={2}>
          <MemoTextField
            required
            id="name"
            name="name"
            label="Название"
            value={formik.values.name}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            size="small"
            color="secondary"
            onChange={formik.handleChange}
          />
          <СhoiceOptionSelect
            value={formik.values.choice_option}
            onChange={formik.handleChange}
          />
          <MemoTextField
            id="display_name"
            name="display_name"
            label="Отображаемое название"
            value={formik.values.display_name}
            error={
              formik.touched.display_name && Boolean(formik.errors.display_name)
            }
            helperText={
              formik.touched.display_name && formik.errors.display_name
            }
            size="small"
            color="secondary"
            onChange={formik.handleChange}
          />
          <DisplayVariantSelect
            value={formik.values.display_variant}
            onChange={formik.handleChange}
          />
          <MemoTextField
            id="display_position"
            name="display_position"
            label="Позиция"
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
          <CheckboxWithLabel
            id="display"
            name="display"
            checked={formik.values.display}
            onChange={formik.handleChange}
            color="secondary"
            size="small"
            label="Отображать"
          />
        </Stack>
      </ModalContent>
      <ModalFooter onCancel={onCancel} />
    </ModalControl>
  );
};

export default ModifierCategoryForm;
