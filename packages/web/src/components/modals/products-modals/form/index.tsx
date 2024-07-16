import React from "react";
import { useFormik } from "formik";
import { Stack, Typography } from "@mui/material";
import {
  Product,
  ProductVolumeTypeEnum,
  ProductWeightTypeEnum,
} from "~/services/products.service";
import validationSchema from "../helpers/validation-schema";
import { ProductCategory } from "~/services/product-categories.service";
import { Modifier } from "~/services/modifiers.service";
import ModifierList from "../helpers/modifiers-list";
import ProductCategoriesSelect from "./components/product-categories-select";
import {
  FormComponentProps,
  MemoTextField,
  ModalContent,
  ModalControl,
  ModalFooter,
  ModalHeader,
  ImageUploader,
  CheckboxWithLabel,
} from "~/ui";
import VolumeTextField from "./components/volume-text-field";
import WeightTextField from "./components/weight-text-field";
import { useStyle } from "../index.style";

export type ProductFormSubmitData = Omit<Product, "uuid"> & {
  image?: File;
};

export interface ProductFormProps
  extends FormComponentProps<ProductFormSubmitData> {
  variant: "create" | "update";
  product?: Product;
  modifiers: Modifier[];
  productCategories: ProductCategory[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  variant,
  product,
  productCategories,
  modifiers,
  onSubmit,
  onCancel,
}) => {
  const { classes } = useStyle();
  const formik = useFormik({
    initialValues: {
      name: product?.name ?? "",
      desc: product?.desc ?? "",
      articleNumber: product?.article_number.toString() ?? "",
      image: undefined,
      imageURL: product?.image_url ?? "",
      price: product?.price.toString() ?? "",
      display: product?.display ?? true,
      categories: product?.categories ?? [],
      modifiers: product?.modifiers ?? [],
      volume: product?.volume?.value.toString() ?? "",
      volumeType: product?.volume?.type ?? ProductVolumeTypeEnum.QUANTITY,
      weight: product?.weight?.value.toString() ?? "",
      weightType: product?.weight?.type ?? ProductWeightTypeEnum.GRAMS,
    },
    validationSchema,
    onSubmit: value => {
      onSubmit &&
        onSubmit({
          name: value.name,
          desc: value.desc?.length ? value.desc : undefined,
          article_number: Number.parseInt(value.articleNumber),
          image: value.image,
          image_url: value.imageURL,
          price: Number.parseFloat(value.price),
          display: value.display,
          categories: value.categories,
          modifiers: value.modifiers,
          weight: value.weight
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
        });
    },
  });

  const setFieldValue = formik.setFieldValue;
  const onCategoriesChange = React.useCallback(
    (categories: ProductCategory[]) => setFieldValue("categories", categories),
    [setFieldValue]
  );
  const onModifiersChange = React.useCallback(
    (modifiers: Modifier[]) => setFieldValue("modifiers", modifiers),
    [setFieldValue]
  );
  const onImageChange = React.useCallback(
    ({ image, imageURL }: { image: File; imageURL: string }) => {
      setFieldValue("image", image);
      setFieldValue("imageURL", imageURL);
    },
    [setFieldValue]
  );

  return (
    <ModalControl component="form" onSubmit={formik.handleSubmit}>
      <ModalHeader
        title={
          variant === "create" ? "Создание нового товара" : "Изменение товара"
        }
      />
      <ModalContent>
        <Stack direction="row" alignItems="center" justifyContent="center">
          <ImageUploader
            image={formik.values.image}
            imageURL={formik.values.imageURL}
            imageWidth={200}
            imageHeight={200}
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
            className={classes.productFeatures}
            spacing={2}
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
            value={formik.values.categories}
            onChange={onCategoriesChange}
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
        {modifiers.length ? (
          <Stack>
            <Typography variant="h6" className={classes.modifierListTitle}>
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

export default ProductForm;
