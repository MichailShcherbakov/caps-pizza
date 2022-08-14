import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { Modal, ModalController, ModalProps } from "~/ui";
import { useCreateProductMutation } from "~/services/products.service";
import CreateProductForm, {
  CreateProductFormProps,
} from "./create-product.form";
import { APIError } from "~/services/helpers/transform-response.helper";
import { useGetProductCategoriesQuery } from "~/services/product-categories.service";
import { useGetModifiersQuery } from "~/services/modifiers.service";
import {
  IMAGE_FILE_SIZE,
  useUploadImageMutation,
} from "~/services/upload.service";
import ModalErrorCatcher from "~/common/components/error-catcher/modal";

export const CreateProductModalControl: React.FC<
  ModalProps & { CreateProductFormProps: CreateProductFormProps }
> = ({ CreateProductFormProps, ...props }) => {
  return (
    <Modal {...props}>
      <CreateProductForm
        {...CreateProductFormProps}
        onCancel={props.onClose}
        onSubmit={e => {
          CreateProductFormProps.onSubmit && CreateProductFormProps.onSubmit(e);
          props.onClose && props.onClose();
        }}
      />
    </Modal>
  );
};

export interface CreateProductModalProps extends ButtonProps {}

export const CreateProductModal: React.FC<CreateProductModalProps> = props => {
  const [error, setError] = React.useState<APIError | undefined>();
  const [createProduct] = useCreateProductMutation();
  const [uploadImage] = useUploadImageMutation();
  const { data: productCategories = [] } = useGetProductCategoriesQuery();
  const { data: modifiers = [] } = useGetModifiersQuery();

  const modalController = React.useCallback(
    ({ open }) => (
      <Button {...props} variant="outlined" color="secondary" onClick={open}>
        Добавить
      </Button>
    ),
    [props]
  );

  const CreateProductModalControlProps = React.useMemo(
    () => ({
      CreateProductFormProps: {
        modifiers,
        productCategories,
        onSubmit: async value => {
          try {
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
          }
        },
      } as CreateProductFormProps,
    }),
    [modifiers, productCategories, uploadImage, createProduct]
  );

  return (
    <>
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={CreateProductModalControl}
        ModalProps={CreateProductModalControlProps}
      >
        {modalController}
      </ModalController>
    </>
  );
};

export default CreateProductModal;
