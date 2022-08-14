import React from "react";
import { useFormik } from "formik";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import UiKit, { FormModalProps } from "~/ui";
import { Modifier } from "~/services/modifiers.service";
import validationSchema from "../helpers/validation-schema";
import { ModifierCategory } from "~/services/modifier-categories.service";

export interface CreateModifierFormProps
  extends Omit<FormModalProps, "title" | "onSubmit"> {
  modifierCategories: ModifierCategory[];
  onSubmit?: (data: Omit<Modifier, "uuid">) => void;
}

export default function CreateModifierForm({
  modifierCategories,
  ...props
}: CreateModifierFormProps) {
  const formik = useFormik({
    initialValues: {
      name: "",
      desc: "",
      article_number: "",
      price: "",
      display_position: "",
      category_uuid: "",
    },
    validationSchema,
    onSubmit: value => {
      props.onSubmit &&
        props.onSubmit({
          name: value.name,
          desc: value.desc ? value.desc : undefined,
          article_number: Number.parseInt(value.article_number),
          price: Number.parseFloat(value.price),
          category_uuid: value.category_uuid,
          display_position:
            Number.parseInt(value.display_position) ?? undefined,
        });
    },
  });

  return (
    <UiKit.FormModal
      {...props}
      title="Создание нового модификатора"
      onSubmit={formik.handleSubmit}
      onCancel={props.onClose}
    >
      <Stack spacing={2}>
        <TextField
          fullWidth
          required
          id="name"
          name="name"
          label="Введите название"
          value={formik.values.name}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          size="small"
          color="secondary"
          onChange={formik.handleChange}
        />
        <TextField
          fullWidth
          id="desc"
          name="desc"
          label="Введите описание"
          value={formik.values.desc}
          error={formik.touched.desc && Boolean(formik.errors.desc)}
          helperText={formik.touched.desc && formik.errors.desc}
          size="small"
          color="secondary"
          onChange={formik.handleChange}
        />
        <Stack direction="row" alignItems="center" spacing={2}>
          <TextField
            fullWidth
            required
            id="article_number"
            name="article_number"
            type="number"
            label="Введите артикул"
            value={formik.values.article_number}
            error={
              formik.touched.article_number &&
              Boolean(formik.errors.article_number)
            }
            helperText={
              formik.touched.article_number && formik.errors.article_number
            }
            size="small"
            color="secondary"
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            required
            id="price"
            name="price"
            type="number"
            label="Введите цену"
            value={formik.values.price}
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
            size="small"
            color="secondary"
            onChange={formik.handleChange}
          />
        </Stack>

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
        <FormControl size="small" fullWidth>
          <InputLabel
            id="modifier-category-select-label"
            color="secondary"
            required
          >
            Категория
          </InputLabel>
          <Select
            required
            id="category_uuid"
            name="category_uuid"
            labelId="modifier-category-select-label"
            value={formik.values.category_uuid}
            label="Категория"
            onChange={formik.handleChange}
            color="secondary"
          >
            {Array.isArray(modifierCategories) &&
              modifierCategories.map(c => (
                <MenuItem key={c.uuid} value={c.uuid}>
                  {c.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Stack>
    </UiKit.FormModal>
  );
}
