import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import {
  useCreateModifierCategoryMutation,
  useGetModifierCategoriesQuery,
} from "~/services/modifier-categories.service";
import {
  Modifier,
  useCreateModifierMutation,
} from "~/services/modifiers.service";
import ModalContent from "~/ui/components/modal/components/content";
import ModalFooter from "~/ui/components/modal/components/footer";
import ModalForm, {
  ModalFormProps,
} from "~/ui/components/modal/components/form";
import ModalHeader from "~/ui/components/modal/components/header";

const validationSchema = yup.object({
  name: yup
    .string()
    .max(50, "Название модификатора не должно превышать 50 символов")
    .required("Это поле является обязательным"),
  desc: yup
    .string()
    .max(50, "Описание модификатора не должно превышать 50 символов"),
  article_number: yup
    .number()
    .positive("Артикул модификатора должен быть положительным")
    .required("Это поле является обязательным"),
  price: yup
    .number()
    .positive("Цена модификатора должена быть положительной")
    .required("Это поле является обязательным"),
  category_uuid: yup.string().required("Это поле является обязательным"),
});

export interface CreateModifierFormProps extends ModalFormProps {
  onCancel?: () => void;
  onSubmit?: () => void;
}

export default function CreateModifierForm({
  onSubmit = () => {},
  onCancel = () => {},
  ...props
}: CreateModifierFormProps) {
  const {
    data: modifierCategories,
    isLoading,
    error,
  } = useGetModifierCategoriesQuery();
  const [createModifier, result] = useCreateModifierMutation();

  const formik = useFormik<Omit<Modifier, "uuid">>({
    initialValues: {
      name: "",
      desc: "",
      article_number: 0,
      price: 0,
      category_uuid: "",
    },
    validationSchema,
    onSubmit: async value => {
      await createModifier({
        name: value.name,
        desc: value.desc?.length ? value.desc : undefined,
        article_number: value.article_number,
        price: value.price,
        category_uuid: value.category_uuid,
      });

      if (result.error) return;

      onSubmit();
    },
  });

  return (
    <ModalForm {...props} onSubmit={formik.handleSubmit}>
      <ModalHeader title="Создание нового модификатора" onExit={onCancel} />
      <ModalContent className="ui-jc-center">
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
        <FormControl fullWidth>
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
      </ModalContent>
      <ModalFooter onCancel={onCancel} />
    </ModalForm>
  );
}
