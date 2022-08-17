import React from "react";
import {
  FormModal,
  LoadingBackdrop,
  ModalController,
  ModalControllerProps,
  ModalProps,
} from "~/ui";
import { useCreateProductMutation } from "~/services/products.service";
import CreateProductForm, {
  CreateProductFormProps,
} from "../forms/create-product.form";
import { APIError } from "~/services/helpers/transform-response.helper";
import { useGetProductCategoriesQuery } from "~/services/product-categories.service";
import { useGetModifiersQuery } from "~/services/modifiers.service";
import {
  IMAGE_FILE_SIZE,
  useUploadImageMutation,
} from "~/services/upload.service";
import ModalErrorCatcher from "~/common/components/error-catcher/modal";

export interface CreateProductModalProps
  extends Pick<ModalControllerProps, "children">,
    Pick<CreateProductFormProps, "onSubmit">,
    Pick<ModalProps, "onClose"> {}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
  children,
  onSubmit,
  onClose,
}) => {
  const [error, setError] = React.useState<APIError | undefined>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [createProduct] = useCreateProductMutation();
  const [uploadImage] = useUploadImageMutation();
  // TODO: remove from here
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
          Form: CreateProductForm,
          FormProps: {
            modifiers,
            productCategories,
            onSubmit: async value => {
              try {
                setLoading(true);

                if (!value.image) {
                  throw new APIError({
                    statusCode: 1020,
                    error: "Client Error",
                    message: `The image not loaded`,
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
          } as CreateProductFormProps,
        }}
      >
        {children}
      </ModalController>
    </>
  );
};

export default CreateProductModal;
