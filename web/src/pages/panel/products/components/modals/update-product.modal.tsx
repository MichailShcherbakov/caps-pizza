import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { ModalController } from "~/ui";
import { Product, useUpdateProductMutation } from "~/services/products.service";
import ErrorHandler from "~/common/components/error-handler";
import UpdateProductForm from "./update-product.form";
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

export interface UpdateProductModalProps extends ButtonProps {
  product: Product;
}

export const UpdateProductModal: React.FC<UpdateProductModalProps> = ({
  product,
  ...props
}) => {
  const [error, setError] = React.useState<APIError | undefined>();
  const [updateProduct] = useUpdateProductMutation();
  const [uploadImage] = useUploadImageMutation();
  const { data: productCategories = [] } = useGetProductCategoriesQuery();
  const { data: modifiers = [] } = useGetModifiersQuery();

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
    [props]
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
        Modal={UpdateProductForm}
        ModalProps={{
          product,
          modifiers,
          productCategories,
          onSubmit: async value => {
            try {
              if (value.image) {
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

                value.image_url = uploadedImage.url;
                value.image = undefined;
              }

              await updateProduct({
                uuid: value.uuid,
                name: value.name,
                desc: value.desc,
                article_number: value.article_number,
                image_url: value.image_url,
                price: value.price,
                category_uuid: value.category_uuid,
                modifiers_uuids: value.modifiers.map(m => m.uuid),
              }).unwrap();
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

export default UpdateProductModal;
