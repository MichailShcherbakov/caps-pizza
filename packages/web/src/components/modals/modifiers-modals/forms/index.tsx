import React from "react";
import { useFormik } from "formik";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import {
  MemoTextField,
  ModalContent,
  ModalControl,
  ModalFooter,
  ModalHeader,
  ImageUploader,
} from "~/ui";
import { Modifier } from "~/services/modifiers.service";
import validationSchema from "../helpers/validation-schema";
import { ModifierCategory } from "~/services/modifier-categories.service";
import CheckboxWithLabel from "~/ui/components/checkbox/with-label";

export type ModifierFormSubmitData = Omit<Modifier, "uuid"> & {
  image?: File;
};

export interface ModifierFormProps {
  modifier?: Modifier;
  modifierCategories: ModifierCategory[];
  onSubmit?: (data: ModifierFormSubmitData) => void;
  onCancel?: () => void;
}

export interface ModifierFormData {
  name: string;
  image?: File;
  image_url?: string;
  desc?: string;
  article_number: string;
  price: string;
  display: boolean;
  display_position: string;
  category_uuid: string;
}

export const ModifierForm: React.FC<ModifierFormProps> = ({
  modifier,
  modifierCategories,
  onSubmit,
  onCancel,
}) => {
  const formik = useFormik<ModifierFormData>({
    initialValues: {
      name: modifier?.name ?? "",
      image: undefined,
      image_url: modifier?.image_url,
      desc: modifier?.desc ?? "",
      article_number: modifier?.article_number.toString() ?? "",
      price: modifier?.price.toString() ?? "",
      display: modifier?.display ?? true,
      display_position: modifier?.display_position?.toString() ?? "",
      category_uuid: modifier?.category_uuid ?? "",
    },
    validationSchema,
    onSubmit: value => {
      onSubmit &&
        onSubmit({
          name: value.name,
          image: value.image,
          image_url: value.image_url,
          desc: value.desc ? value.desc : undefined,
          article_number: Number.parseInt(value.article_number),
          price: Number.parseFloat(value.price),
          display: value.display,
          display_position:
            Number.parseInt(value.display_position) ?? undefined,
          category_uuid: value.category_uuid,
        });
    },
  });

  const setFieldValue = formik.setFieldValue;
  const onImageChange = React.useCallback(
    ({ image, imageURL }: { image: File; imageURL: string }) => {
      setFieldValue("image", image);
      setFieldValue("image_url", imageURL);
    },
    [setFieldValue]
  );

  return (
    <ModalControl component="form" onSubmit={formik.handleSubmit}>
      <ModalHeader title="Изменение модификатора" />
      <ModalContent>
        <Stack spacing={2}>
          <ImageUploader
            image={formik.values.image}
            imageURL={formik.values.image_url}
            imageWidth={200}
            imageHeight={200}
            touched={formik.touched.image_url}
            errors={formik.errors.image_url}
            onChange={onImageChange}
          />
          <MemoTextField
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
          <MemoTextField
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
            <MemoTextField
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
            <MemoTextField
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">₽</InputAdornment>
                ),
              }}
            />
          </Stack>
          <MemoTextField
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

export default ModifierForm;
