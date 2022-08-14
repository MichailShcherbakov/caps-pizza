import React from "react";
import { useFormik } from "formik";
import NextImage from "next/image";
import { IconButton, Stack, TextField, Tooltip } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import UiKit, { ExternalSvg, FormModalProps } from "~/ui";
import validationSchema from "../helpers/validation-schema";
import { ProductCategory } from "~/services/product-categories.service";

export type UpdateProductCategorySubmitData = ProductCategory & {
  image?: File;
};

export interface UpdateProductCategoryFormProps
  extends Omit<FormModalProps, "title" | "onSubmit"> {
  category: ProductCategory;
  onSubmit?: (data: UpdateProductCategorySubmitData) => void;
}

export default function UpdateProductCategoryForm({
  category,
  ...props
}: UpdateProductCategoryFormProps) {
  const formik = useFormik({
    initialValues: {
      name: category.name,
      image: undefined,
      image_url: category.image_url,
      display_position: category.display_position?.toString() ?? "",
    },
    validationSchema,
    onSubmit: value => {
      props.onSubmit &&
        props.onSubmit({
          ...category,
          name: value.name,
          image: value.image,
          display_position:
            Number.parseInt(value.display_position) ?? undefined,
        });
    },
  });

  return (
    <UiKit.FormModal
      {...props}
      title="Изменение категории товара"
      onSubmit={formik.handleSubmit}
      onCancel={props.onClose}
    >
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
              formik.values.image ? (
                <NextImage
                  src={formik.values.image_url}
                  alt="loaded image"
                  width={32}
                  height={32}
                  layout="fixed"
                />
              ) : (
                <ExternalSvg
                  src={`${process.env.NEXT_PUBLIC_IMAGES_SOURCE_URL}${category.image_url}`}
                  className="ui-w-12 ui-h-12"
                />
              )
            ) : (
              <ImageIcon />
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
    </UiKit.FormModal>
  );
}
