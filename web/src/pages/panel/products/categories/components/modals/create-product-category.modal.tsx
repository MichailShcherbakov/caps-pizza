import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { ModalController } from "~/ui";
import { useCreateProductCategoryMutation } from "~/services/product-categories.service";
import ErrorHandler from "~/common/components/error-handler";
import CreateProductCategoryForm, {
  CreateProductCategorySubmitData,
} from "./create-product-category.form";
import { APIError } from "~/services/helpers/transform-response.helper";
import { UnknownApiError } from "~/common/components/error-handler/api-errors";
import {
  TheFileIsTooLargeApiError,
  TheNameAlreadyExistsApiError,
} from "../api-errors";
import {
  IMAGE_FILE_SIZE,
  useUploadImageMutation,
} from "~/services/upload.service";

export interface CreateProductCategoryModalProps extends ButtonProps {}

export const CreateProductCategoryModal: React.FC<
  CreateProductCategoryModalProps
> = props => {
  const [error, setError] = React.useState<APIError | undefined>();
  const [createProductCategory] = useCreateProductCategoryMutation();
  const [uploadImage] = useUploadImageMutation();

  const modalController = React.useCallback(
    ({ open }) => (
      <Button {...props} variant="contained" color="secondary" onClick={open}>
        Добавить
      </Button>
    ),
    [props]
  );

  const createProductCategoryFormProps = React.useMemo(
    () => ({
      onSubmit: async ({
        name,
        image,
        display_position,
      }: CreateProductCategorySubmitData) => {
        try {
          if (image.size > IMAGE_FILE_SIZE)
            throw new APIError({
              statusCode: 1010,
              error: "Client Error",
              message: `The image size greater then ${
                IMAGE_FILE_SIZE / 1024
              } kb`,
            });

          const formData = new FormData();
          formData.append("file", image);

          const uploadedImage = await uploadImage(formData).unwrap();

          if (!uploadedImage) return;

          await createProductCategory({
            name,
            image_url: uploadedImage.url,
            display_position,
          });
        } catch (e) {
          setError(e);
        }
      },
    }),
    [uploadImage, createProductCategory]
  );

  return (
    <>
      <ErrorHandler error={error}>
        <TheFileIsTooLargeApiError />
        <TheNameAlreadyExistsApiError />
        <UnknownApiError />
      </ErrorHandler>
      <ModalController
        Modal={CreateProductCategoryForm}
        ModalProps={createProductCategoryFormProps}
      >
        {modalController}
      </ModalController>
    </>
  );
};

export default CreateProductCategoryModal;
