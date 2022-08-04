import { TextField } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import { useCreateModifierCategoryMutation } from "~/services/modifier-categories.service";
import ModalContent from "~/ui/components/modal/components/content";
import ModalFooter from "~/ui/components/modal/components/footer";
import ModalForm, {
  ModalFormProps,
} from "~/ui/components/modal/components/form";
import ModalHeader from "~/ui/components/modal/components/header";

const validationSchema = yup.object({
  name: yup
    .string()
    .max(50, "Название типа не должно превышать 50 символов")
    .required("Это поле является обязательным"),
});

export interface CreateModifierCategoryFormProps extends ModalFormProps {
  onCancel?: () => void;
  onSubmit?: () => void;
}

export default function CreateModifierCategoryForm({
  onSubmit = () => {},
  onCancel = () => {},
  ...props
}: CreateModifierCategoryFormProps) {
  const [createModifierCategory, result] = useCreateModifierCategoryMutation();

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: async value => {
      await createModifierCategory({
        name: value.name,
      });

      if (result.error) return;

      onSubmit();
    },
  });

  return (
    <ModalForm {...props} onSubmit={formik.handleSubmit}>
      <ModalHeader
        title="Создание нового типа модификаторов"
        onExit={onCancel}
      />
      <ModalContent className="ui-jc-center">
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
      </ModalContent>
      <ModalFooter onCancel={onCancel} />
    </ModalForm>
  );
}
