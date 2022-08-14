import React from "react";
import { useFormik } from "formik";
import NextImage from "next/image";
import { IconButton, Stack, TextField, Tooltip } from "@mui/material";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import { ModalContent, ModalControl, ModalFooter, ModalHeader } from "~/ui";
import { ProductCategory } from "~/services/product-categories.service";
import validationSchema from "../helpers/validation-schema";

export type CreateProductCategorySubmitData = Omit<ProductCategory, "uuid"> & {
  image?: File;
};

export interface CreateProductCategoryFormProps {
  onSubmit?: (data: CreateProductCategorySubmitData) => void;
  onCancel?: () => void;
}

export const CreateProductCategoryForm: React.FC<
  CreateProductCategoryFormProps
> = ({ onSubmit, onCancel }) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      image: undefined,
      image_url: "",
      display_position: "",
    },
    validationSchema,
    onSubmit: value => {
      onSubmit &&
        onSubmit({
          name: value.name,
          image: value.image,
          image_url: value.image_url,
          display_position:
            Number.parseInt(value.display_position) ?? undefined,
        });
    },
  });

  return (
    <ModalControl component="form" onSubmit={formik.handleSubmit}>
      <ModalHeader title="Создание новой категории товаров" />
      <ModalContent>
        <Stack direction="row" alignItems="center" spacing={2}>
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
          <Tooltip
            title="Загрузите изображение"
            open={
              Boolean(formik.touched.image_url) &&
              Boolean(formik.errors.image_url)
            }
            disableFocusListener
            disableHoverListener
            disableTouchListener
          >
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
                  if (!e.currentTarget?.files?.length) return;

                  const image = e.currentTarget.files[0];

                  formik.setFieldValue("image", image);
                  formik.setFieldValue("image_url", URL.createObjectURL(image));
                }}
              />
              {formik.values.image_url ? (
                <NextImage
                  src={formik.values.image_url}
                  alt="loaded image"
                  width={32}
                  height={32}
                  layout="fixed"
                />
              ) : (
                <InsertPhotoOutlinedIcon />
              )}
            </IconButton>
          </Tooltip>
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
      </ModalContent>
      <ModalFooter onCancel={onCancel} />
    </ModalControl>
  );
};

export default CreateProductCategoryForm;
