import React from "react";
import { useFormik } from "formik";
import { Stack } from "@mui/material";
import {
  MemoTextField,
  ModalContent,
  ModalControl,
  ModalFooter,
  ModalHeader,
  ImageUploader,
} from "~/ui";
import validationSchema from "../helpers/validation-schema";
import { Promotion } from "~/services/promotions.service";
import CheckboxWithLabel from "~/ui/components/checkbox/with-label";

export type PromotionFormSubmitData = Omit<Promotion, "uuid"> & {
  image?: File;
};

export interface PromotionFormProps {
  variant: "create" | "update";
  promotion?: Promotion;
  onSubmit?: (data: PromotionFormSubmitData) => void;
  onCancel?: () => void;
}

export const PromotionForm: React.FC<PromotionFormProps> = ({
  variant,
  promotion,
  onSubmit,
  onCancel,
}) => {
  const formik = useFormik({
    initialValues: {
      name: promotion?.name ?? "",
      image: undefined,
      image_url: promotion?.image_url ?? "",
      display: promotion?.display ?? true,
      display_position: promotion?.display_position.toString() ?? "",
    },
    validationSchema,
    onSubmit: value => {
      onSubmit &&
        onSubmit({
          name: value.name,
          image: value.image,
          image_url: value.image_url,
          display: Boolean(value.display),
          display_position: Number.parseInt(value.display_position),
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
      <ModalHeader
        title={variant === "create" ? "Создание акции" : "Изменение акции"}
      />
      <ModalContent>
        <Stack spacing={2}>
          <Stack pb={2}>
            <ImageUploader
              image={formik.values.image}
              imageURL={formik.values.image_url}
              imageWidth={200}
              imageHeight={200}
              touched={formik.touched.image_url}
              errors={formik.errors.image_url}
              onChange={onImageChange}
            />
          </Stack>
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

export default PromotionForm;
