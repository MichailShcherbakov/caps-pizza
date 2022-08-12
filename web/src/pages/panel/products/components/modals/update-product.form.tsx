import React from "react";
import { useFormik } from "formik";
import {
  Button,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import UiKit, { ExternalSvg, FormModalProps } from "~/ui";
import { Product } from "~/services/products.service";
import validationSchema from "../helpers/validation-schema";
import { ProductCategory } from "~/services/product-categories.service";
import NextImage from "next/image";
import ImageIcon from "@mui/icons-material/Image";
import styles from "../index.module.scss";
import { Modifier } from "~/services/modifiers.service";
import ModifierList from "../helpers/modifiers-list";

export interface UpdateProductFormProps
  extends Omit<FormModalProps, "title" | "onSubmit"> {
  product: Product;
  modifiers: Modifier[];
  productCategories: ProductCategory[];
  onSubmit?: (data: Product & { image: File }) => void;
}

export default function UpdateProductForm({
  product,
  productCategories,
  modifiers,
  ...props
}: UpdateProductFormProps) {
  const formik = useFormik({
    initialValues: {
      name: product.name,
      desc: product.desc,
      article_number: product.article_number.toString(),
      image: null,
      image_url: product.image_url,
      price: product.price.toString(),
      category_uuid: product.category_uuid,
      modifiers: product.modifiers,
    },
    validationSchema,
    onSubmit: value => {
      props.onSubmit &&
        props.onSubmit({
          ...product,
          name: value.name,
          desc: value.desc ? value.desc : undefined,
          article_number: Number.parseInt(value.article_number),
          image: value.image,
          image_url: value.image_url,
          price: Number.parseFloat(value.price),
          category_uuid: value.category_uuid,
          modifiers: value.modifiers,
        });
    },
  });

  return (
    <UiKit.FormModal
      {...props}
      title="Создание нового товара"
      onSubmit={formik.handleSubmit}
      onCancel={props.onClose}
    >
      <Stack direction="row" alignItems="center" justifyContent="center">
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
          <Button
            aria-label="upload picture"
            component="label"
            className={styles["upload-image-btn"]}
            variant={formik.values.image_url ? "text" : "outlined"}
            color="neutral"
          >
            <input
              hidden
              id="image"
              name="image"
              accept="image/jpeg,image/x-png"
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
                  width={300}
                  height={300}
                />
              ) : (
                <NextImage
                  src={`${process.env.NEXT_PUBLIC_IMAGES_SOURCE_URL}${formik.values.image_url}`}
                  alt="loaded image"
                  width={300}
                  height={300}
                />
              )
            ) : (
              <ImageIcon />
            )}
          </Button>
        </Tooltip>
      </Stack>
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
        <FormControl fullWidth>
          <InputLabel
            id="product-category-select-label"
            color="secondary"
            required
          >
            Категория
          </InputLabel>
          <Select
            required
            id="category_uuid"
            name="category_uuid"
            labelId="product-category-select-label"
            value={formik.values.category_uuid}
            label="Категория"
            onChange={formik.handleChange}
            color="secondary"
            className={styles["category-select"]}
          >
            {Array.isArray(productCategories) &&
              productCategories.map(c => (
                <MenuItem key={c.uuid} value={c.uuid}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    className="ui-mr-8"
                  >
                    <ExternalSvg
                      src={`${process.env.NEXT_PUBLIC_IMAGES_SOURCE_URL}${c.image_url}`}
                      className="ui-w-10 ui-h-10"
                    />
                  </Stack>
                  <ListItemText>{c.name}</ListItemText>
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Stack>
      <ModifierList
        modifiers={modifiers}
        value={formik.values.modifiers}
        onChange={value => formik.setFieldValue("modifiers", value)}
      />
    </UiKit.FormModal>
  );
}
