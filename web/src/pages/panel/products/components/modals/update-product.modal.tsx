import React from "react";
import { Modal, ModalController, ModalControllerProps, ModalProps } from "~/ui";
import { Product, useUpdateProductMutation } from "~/services/products.service";
import UpdateProductForm, {
  UpdateProductFormProps,
} from "./update-product.form";
import { APIError } from "~/services/helpers/transform-response.helper";
import { useGetProductCategoriesQuery } from "~/services/product-categories.service";
import { useGetModifiersQuery } from "~/services/modifiers.service";
import {
  IMAGE_FILE_SIZE,
  useUploadImageMutation,
} from "~/services/upload.service";
import ModalErrorCatcher from "~/common/components/error-catcher/modal";

export const UpdateProductModalControl: React.FC<
  ModalProps & { UpdateProductFormProps: UpdateProductFormProps }
> = ({ UpdateProductFormProps, ...props }) => {
  return (
    <Modal {...props}>
      <UpdateProductForm
        {...UpdateProductFormProps}
        onCancel={props.onClose}
        onSubmit={e => {
          UpdateProductFormProps.onSubmit && UpdateProductFormProps.onSubmit(e);
          props.onClose && props.onClose();
        }}
      />
    </Modal>
  );
};

export interface UpdateProductModalProps
  extends Pick<ModalControllerProps, "children"> {
  product: Product;
  onSubmit?: () => void;
  onClose?: () => void;
}

export const UpdateProductModal: React.FC<UpdateProductModalProps> = ({
  product,
  children,
  onSubmit,
  onClose,
}) => {
  const [error, setError] = React.useState<APIError | undefined>();
  const [updateProduct] = useUpdateProductMutation();
  const [uploadImage] = useUploadImageMutation();
  const { data: productCategories = [] } = useGetProductCategoriesQuery();
  const { data: modifiers = [] } = useGetModifiersQuery();

  return (
    <>
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={UpdateProductModalControl}
        ModalProps={{
          onSubmit,
          onClose,
          UpdateProductFormProps: {
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
                  volume: value.volume,
                  weight: value.weight,
                  tags: value.tags,
                  price: value.price,
                  category_uuid: value.category_uuid,
                  modifiers_uuids: value.modifiers.map(m => m.uuid),
                }).unwrap();
              } catch (e) {
                setError(e);
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
