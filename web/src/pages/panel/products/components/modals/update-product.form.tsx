import React from "react";
import { useFormik } from "formik";
import { Stack, Typography } from "@mui/material";
import {
  MemoTextField,
  ModalContent,
  ModalControl,
  ModalFooter,
  ModalHeader,
  TagsTextField,
} from "~/ui";
import {
  Product,
  ProductVolumeType,
  ProductWeightType,
} from "~/services/products.service";
import validationSchema from "../helpers/validation-schema";
import { ProductCategory } from "~/services/product-categories.service";
import { Modifier } from "~/services/modifiers.service";
import ModifierList from "../helpers/modifiers-list";
import ImageUploader from "./components/image-uploader";
import VolumeTextField from "./components/volume-text-field";
import WeightTextField from "./components/weight-text-field";
import ProductCategoriesSelect from "./components/product-categories-select";
import styles from "../index.module.scss";

export interface UpdateProductFormProps {
  product: Product;
  modifiers: Modifier[];
  productCategories: ProductCategory[];
  onSubmit?: (data: Product & { image?: File }) => void;
  onCancel?: () => void;
}

export const UpdateProductForm: React.FC<UpdateProductFormProps> = ({
  product,
  productCategories,
  modifiers,
  onSubmit,
  onCancel,
}) => {
  const formik = useFormik({
    initialValues: {
      name: product.name,
      desc: product.desc,
      articleNumber: product.article_number.toString(),
      image: undefined,
      imageURL: product.image_url,
      price: product.price.toString(),
      categoryUUID: product.category_uuid,
      modifiers: product.modifiers,
      volume: product.volume?.value.toString() ?? "",
      volumeType: product.volume?.type ?? ProductVolumeType.QUANTITY,
      weight: product.weight?.value.toString() ?? "",
      weightType: product.weight?.type ?? ProductWeightType.GRAMS,
      tags: product.tags ?? [],
    },
    validationSchema,
    onSubmit: value => {
      onSubmit &&
        onSubmit({
          uuid: product.uuid,
          name: value.name,
          desc: value.desc ? value.desc : undefined,
          article_number: Number.parseInt(value.articleNumber),
          image: value.image,
          image_url: value.imageURL,
          price: Number.parseFloat(value.price),
          category_uuid: value.categoryUUID,
          modifiers: value.modifiers,
          weight: Number.parseInt(value.weight)
            ? {
                type: value.weightType,
                value: Number.parseInt(value.weight),
              }
            : undefined,
          volume: Number.parseInt(value.volume)
            ? {
                type: value.volumeType,
                value: Number.parseInt(value.volume),
              }
            : undefined,
          tags: value.tags,
        });
    },
  });

  const setFieldValue = formik.setFieldValue;
  const onModifiersChange = React.useCallback(
    value => setFieldValue("modifiers", value),
    [setFieldValue]
  );
  const onImageChange = React.useCallback(
    ({ image, imageURL }) => {
      setFieldValue("image", image);
      setFieldValue("imageURL", imageURL);
    },
    [setFieldValue]
  );
  const onTagsChange = React.useCallback(
    tags => {
      setFieldValue("tags", tags);
    },
    [setFieldValue]
  );

  return (
    <ModalControl component="form" onSubmit={formik.handleSubmit}>
      <ModalHeader title={"Изменение товара"} />
      <ModalContent>
        <Stack direction="row" alignItems="center" justifyContent="center">
          <ImageUploader
            image={formik.values.image}
            imageURL={formik.values.imageURL}
            touched={formik.touched.imageURL}
            errors={formik.errors.imageURL}
            onChange={onImageChange}
          />
        </Stack>
        <Stack spacing={2}>
          <MemoTextField
            fullWidth
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
          <MemoTextField
            fullWidth
            id="desc"
            name="desc"
            label="Описание"
            value={formik.values.desc}
            error={formik.touched.desc && Boolean(formik.errors.desc)}
            helperText={formik.touched.desc && formik.errors.desc}
            size="small"
            color="secondary"
            onChange={formik.handleChange}
          />
          <Stack
            direction="row"
            alignItems="center"
            className={styles["product-form__features"]}
          >
            <VolumeTextField
              volume={formik.values.volume}
              touched={formik.touched.volume}
              errors={formik.errors.volume}
              volumeType={formik.values.volumeType}
              onChange={formik.handleChange}
            />
            <WeightTextField
              weight={formik.values.weight}
              touched={formik.touched.weight}
              errors={formik.errors.weight}
              weightType={formik.values.weightType}
              onChange={formik.handleChange}
            />
          </Stack>
          <TagsTextField
            id="tags"
            name="tags"
            tags={formik.values.tags}
            touched={formik.touched.tags}
            errors={formik.errors.tags}
            onChange={onTagsChange}
          />
          <Stack direction="row" alignItems="center" spacing={2}>
            <MemoTextField
              fullWidth
              required
              id="articleNumber"
              name="articleNumber"
              type="number"
              label="Артикул"
              value={formik.values.articleNumber}
              error={
                formik.touched.articleNumber &&
                Boolean(formik.errors.articleNumber)
              }
              helperText={
                formik.touched.articleNumber && formik.errors.articleNumber
              }
              size="small"
              color="secondary"
              onChange={formik.handleChange}
            />
            <MemoTextField
              fullWidth
              required
              id="price"
              name="price"
              type="number"
              label="Цена"
              value={formik.values.price}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
              size="small"
              color="secondary"
              onChange={formik.handleChange}
            />
          </Stack>
          <ProductCategoriesSelect
            productCategories={productCategories}
            value={formik.values.categoryUUID}
            onChange={formik.handleChange}
          />
        </Stack>
        {modifiers.length ? (
          <Stack>
            <Typography variant="h6" className={styles["modifier-list__title"]}>
              Модификаторы
            </Typography>
            <ModifierList
              value={formik.values.modifiers}
              modifiers={modifiers}
              onChange={onModifiersChange}
            />
          </Stack>
        ) : undefined}
      </ModalContent>
      <ModalFooter onCancel={onCancel} />
    </ModalControl>
  );
};

export default UpdateProductForm;
