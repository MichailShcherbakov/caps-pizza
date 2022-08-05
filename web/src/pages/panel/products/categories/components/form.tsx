import { IconButton, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import { useCreateProductCategoryMutation } from "~/services/product-categories.service";
import ModalContent from "~/ui/components/modal/components/content";
import ModalFooter from "~/ui/components/modal/components/footer";
import ModalForm, {
  ModalFormProps,
} from "~/ui/components/modal/components/form";
import ModalHeader from "~/ui/components/modal/components/header";
import ImageIcon from "@mui/icons-material/Image";
import { Image, useUploadImageMutation } from "~/services/upload.service";
import {
  APIData,
  APIError,
} from "~/services/helpers/transform-response.helper";
import NextImage from "next/image";

const validationSchema = yup.object({
  name: yup
    .string()
    .max(50, "Название категории не должно превышать 50 символов")
    .required("Это поле является обязательным"),
});

export interface CreateProductCategoryFormProps extends ModalFormProps {
  onCancel?: () => void;
  onSubmit?: () => void;
}

export default function CreateProductCategoryForm({
  onSubmit = () => {},
  onCancel = () => {},
  ...props
}: CreateProductCategoryFormProps) {
  const [createProductCategory] = useCreateProductCategoryMutation();
  const [uploadImage] = useUploadImageMutation();

  const formik = useFormik({
    initialValues: {
      name: "",
      image: null,
    },
    validationSchema,
    onSubmit: async value => {
      if (!value.image) return;

      const formData = new FormData();
      formData.append("file", value.image);

      const imageOrError = await uploadImage(formData).unwrap();

      if ((imageOrError as APIError).error) return;

      const categoryOrError = await createProductCategory({
        name: value.name,
        image_url: (imageOrError as APIData<Image>).url,
      }).unwrap();

      if ((categoryOrError as APIError).error) return;

      onSubmit();
    },
  });

  return (
    <ModalForm {...props} onSubmit={formik.handleSubmit}>
      <ModalHeader title="Создание новой категории товаров" onExit={onCancel} />
      <ModalContent className="ui-jc-center">
        <Stack direction="row" alignItems="center" spacing={1}>
          <TextField
            fullWidth
            required
            id="name"
            name="name"
            label="Введите название категории"
            value={formik.values.name}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            size="small"
            color="secondary"
            onChange={formik.handleChange}
          />
          <IconButton
            color="secondary"
            aria-label="upload picture"
            component="label"
          >
            <input
              hidden
              id="image"
              name="image"
              accept="image/svg+xml"
              type="file"
              onChange={e => {
                if (!e.currentTarget?.files) return;

                const image = e.currentTarget.files[0];

                if (image.size > 200 * 1024) return; // greater than 200 kb

                formik.setFieldValue("image", image);
              }}
            />
            {formik.values.image ? (
              <NextImage
                src={URL.createObjectURL(formik.values.image)}
                alt=""
                width={20}
                height={20}
              />
            ) : (
              <ImageIcon />
            )}
          </IconButton>
        </Stack>
      </ModalContent>
      <ModalFooter onCancel={onCancel} />
    </ModalForm>
  );
}
