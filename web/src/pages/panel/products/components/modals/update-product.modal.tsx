import React from "react";
import {
  FormModal,
  LoadingBackdrop,
  ModalController,
  ModalControllerProps,
  ModalProps,
} from "~/ui";
import { Product, useUpdateProductMutation } from "~/services/products.service";
import UpdateProductForm, {
  UpdateProductFormProps,
} from "../forms/update-product.form";
import { APIError } from "~/services/helpers/transform-response.helper";
import { useGetProductCategoriesQuery } from "~/services/product-categories.service";
import { useGetModifiersQuery } from "~/services/modifiers.service";
import {
  IMAGE_FILE_SIZE,
  useUploadImageMutation,
} from "~/services/upload.service";
import ModalErrorCatcher from "~/common/components/error-catcher/modal";

export interface UpdateProductModalProps
  extends Pick<ModalControllerProps, "children">,
    Pick<UpdateProductFormProps, "onSubmit">,
    Pick<ModalProps, "onClose"> {
  product: Product;
}

export const UpdateProductModal: React.FC<UpdateProductModalProps> = ({
  product,
  children,
  onSubmit,
  onClose,
}) => {
  const [error, setError] = React.useState<APIError | undefined>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [updateProduct] = useUpdateProductMutation();
  const [uploadImage] = useUploadImageMutation();
  const { data: productCategories = [] } = useGetProductCategoriesQuery();
  const { data: modifiers = [] } = useGetModifiersQuery();

  return (
    <>
      <LoadingBackdrop color="secondary" open={loading} />
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={FormModal}
        ModalProps={{
          onSubmit,
          onClose,
          Form: UpdateProductForm,
          FormProps: {
            product,
            modifiers,
            productCategories,
            onSubmit: async value => {
              try {
                setLoading(true);

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
                  volume: value.volume,
                  weight: value.weight,
                  tags: value.tags,
                  price: value.price,
                  category_uuid: value.category_uuid,
                  modifiers_uuids: value.modifiers.map(m => m.uuid),
                }).unwrap();
              } catch (e) {
                setError(e);
              } finally {
                setLoading(false);
              }
            },
          } as UpdateProductFormProps,
        }}
      >
        {children}
      </ModalController>
    </>
  );
};

export default UpdateProductModal;
