import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { ModalController } from "~/ui";
import { useCreateProductMutation } from "~/services/products.service";
import ErrorHandler from "~/common/components/error-handler";
import CreateProductForm, {
  CreateProductFormProps,
} from "./create-product.form";
import { APIError } from "~/services/helpers/transform-response.helper";
import { UnknownApiError } from "~/common/components/error-handler/api-errors";
import { useGetProductCategoriesQuery } from "~/services/product-categories.service";
import { useGetModifiersQuery } from "~/services/modifiers.service";
import {
  IMAGE_FILE_SIZE,
  useUploadImageMutation,
} from "~/services/upload.service";
import {
  TheArticleNumberAlreadyExistsApiError,
  TheFileIsTooLargeApiError,
  TheModifierNotFoundApiError,
  TheProductCategoryNotFoundApiError,
  TheProductHasSeveralModifiersOneCategoryApiError,
} from "../api-errors";

export interface CreateProductModalProps extends ButtonProps {}

export const CreateProductModal: React.FC<CreateProductModalProps> = props => {
  const [error, setError] = React.useState<APIError | undefined>();
  const [createProduct] = useCreateProductMutation();
  const [uploadImage] = useUploadImageMutation();
  const { data: productCategories = [] } = useGetProductCategoriesQuery();
  const { data: modifiers = [] } = useGetModifiersQuery();

  const modalController = React.useCallback(
    ({ open }) => (
      <Button {...props} variant="contained" color="secondary" onClick={open}>
        Добавить
      </Button>
    ),
    [props]
  );

  const createProductFormProps = React.useMemo(
    () =>
      ({
        modifiers,
        productCategories,
        onSubmit: async value => {
          try {
            if (!value.image) {
              throw new APIError({
                statusCode: 1010,
                error: "Client Error",
                message: `The image is not loaded`,
              });
            }

            if (value.image.size > IMAGE_FILE_SIZE)
              throw new APIError({
                statusCode: 1010,
                error: "Client Error",
                message: `The image size greater then ${
                  IMAGE_FILE_SIZE / 1024
                } kb`,
              });

            const formData = new FormData();
            formData.append("file", value.image);

            const uploadedImage = await uploadImage(formData).unwrap();

            if (!uploadedImage) return;

            await createProduct({
              name: value.name,
              desc: value.desc,
              article_number: value.article_number,
              image_url: uploadedImage.url,
              price: value.price,
              category_uuid: value.category_uuid,
              modifiers_uuids: value.modifiers.map(m => m.uuid),
            }).unwrap();
          } catch (e) {
            setError(e);
          }
        },
      } as Partial<CreateProductFormProps>),
    [modifiers, productCategories, uploadImage, createProduct]
  );

  return (
    <>
      <ErrorHandler error={error}>
        <TheProductCategoryNotFoundApiError />
        <TheModifierNotFoundApiError />
        <TheProductHasSeveralModifiersOneCategoryApiError />
        <TheArticleNumberAlreadyExistsApiError />
        <TheFileIsTooLargeApiError />
        <UnknownApiError />
      </ErrorHandler>
      <ModalController
        Modal={CreateProductForm}
        ModalProps={createProductFormProps}
      >
        {modalController}
      </ModalController>
    </>
  );
};

export default CreateProductModal;
