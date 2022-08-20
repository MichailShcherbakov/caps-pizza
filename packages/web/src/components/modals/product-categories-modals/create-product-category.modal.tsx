import React from "react";
import {
  FormModal,
  LoadingBackdrop,
  ModalController,
  ModalControllerProps,
  ModalProps,
} from "~/ui";
import { useCreateProductCategoryMutation } from "~/services/product-categories.service";
import ProductCategoryForm, {
  ProductCategoryFormProps,
  ProductCategorySubmitData,
} from "./form";
import { APIError } from "~/services/helpers/transform-response.helper";
import { useUploadImageMutation } from "~/services/upload.service";
import ModalErrorCatcher from "~/components/error-catcher/modal";
import { IMAGE_FILE_SIZE } from "@monorepo/common";

export interface CreateProductCategoryModalProps
  extends Pick<ModalProps, "onClose">,
    Pick<ModalControllerProps, "children"> {}

export const CreateProductCategoryModal: React.FC<
  CreateProductCategoryModalProps
> = ({ children }) => {
  const [error, setError] = React.useState<APIError | undefined>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [createProductCategory] = useCreateProductCategoryMutation();
  const [uploadImage] = useUploadImageMutation();

  return (
    <>
      <LoadingBackdrop color="secondary" open={loading} />
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={FormModal<ProductCategoryFormProps, ProductCategorySubmitData>}
        ModalProps={{
          Form: ProductCategoryForm,
          FormProps: {
            variant: "create",
            onSubmit: async ({ name, image, display_position }) => {
              try {
                setLoading(true);

                if (!image || image.size > IMAGE_FILE_SIZE)
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
                }).unwrap();
              } catch (e) {
                setError(e);
              } finally {
                setLoading(false);
              }
            },
          },
        }}
      >
        {children}
      </ModalController>
    </>
  );
};

export default CreateProductCategoryModal;
