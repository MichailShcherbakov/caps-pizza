import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { ModalController } from "~/ui";
import {
  ProductCategory,
  useUpdateProductCategoryMutation,
} from "~/services/product-categories.service";
import ErrorHandler from "~/common/components/error-handler";
import UpdateProductCategoryForm from "./update-product-category.form";
import { APIError } from "~/services/helpers/transform-response.helper";
import { UnknownApiError } from "~/common/components/error-handler/api-errors";
import {
  TheFileIsTooLargeApiError,
  TheNameAlreadyExistsApiError,
} from "../api-errors";
import { useUploadImageMutation } from "~/services/upload.service";
import { UpdateProductCategorySubmitData } from "./update-product-category.form";
import { IMAGE_FILE_SIZE } from "../helpers/config";

export interface UpdateProductCategoryModalProps extends ButtonProps {
  category: ProductCategory;
}

export const UpdateProductCategoryModal: React.FC<
  UpdateProductCategoryModalProps
> = ({ category, ...props }) => {
  const [error, setError] = React.useState<APIError | undefined>();
  const [updateProductCategory] = useUpdateProductCategoryMutation();
  const [uploadImage] = useUploadImageMutation();

  const modalController = React.useCallback(
    ({ open }) => (
      <Button
        {...props}
        variant="outlined"
        color="warning"
        size="small"
        onClick={open}
      >
        Изменить
      </Button>
    ),
    []
  );

  return (
    <>
      <ErrorHandler error={error}>
        <TheFileIsTooLargeApiError />
        <TheNameAlreadyExistsApiError />
        <UnknownApiError />
      </ErrorHandler>
      <ModalController
        Modal={UpdateProductCategoryForm}
        ModalProps={{
          category,
          onSubmit: async (category: UpdateProductCategorySubmitData) => {
            try {
              if (category.image) {
                if (category.image.size > IMAGE_FILE_SIZE)
                  throw new APIError({
                    statusCode: 1010,
                    error: "Client Error",
                    message: `The image size greater then ${
                      IMAGE_FILE_SIZE / 1024
                    } kb`,
                  });

                const formData = new FormData();
                formData.append("file", category.image);

                const uploadedImage = await uploadImage(formData).unwrap();

                if (!uploadedImage) return;

                category.image_url = uploadedImage.url;
                category.image = undefined;
              }

              await updateProductCategory(category);
            } catch (e) {
              setError(e);
            }
          },
        }}
      >
        {modalController}
      </ModalController>
    </>
  );
};

export default UpdateProductCategoryModal;
