import React from "react";
import {
  FormModal,
  ModalController,
  ModalControllerProps,
  ModalProps,
} from "~/ui";
import { useCreateProductCategoryMutation } from "~/services/product-categories.service";
import CreateProductCategoryForm, {
  CreateProductCategoryFormProps,
} from "../forms/create-product-category.form";
import { APIError } from "~/services/helpers/transform-response.helper";
import {
  IMAGE_FILE_SIZE,
  useUploadImageMutation,
} from "~/services/upload.service";
import ModalErrorCatcher from "~/common/components/error-catcher/modal";

export interface CreateProductCategoryModalProps
  extends Pick<ModalControllerProps, "children">,
    Pick<CreateProductCategoryFormProps, "onSubmit">,
    Pick<ModalProps, "onClose"> {}

export const CreateProductCategoryModal: React.FC<
  CreateProductCategoryModalProps
> = ({ children }) => {
  const [error, setError] = React.useState<APIError | undefined>();
  const [createProductCategory] = useCreateProductCategoryMutation();
  const [uploadImage] = useUploadImageMutation();

  const createProductCategoryFormProps = React.useMemo(
    () => ({
      Form: CreateProductCategoryForm,
      FormProps: {
        onSubmit: async ({ name, image, display_position }) => {
          try {
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
            });
          } catch (e) {
            setError(e);
          }
        },
      },
    }),
    [uploadImage, createProductCategory]
  );

  return (
    <>
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={FormModal}
        ModalProps={createProductCategoryFormProps}
      >
        {children}
      </ModalController>
    </>
  );
};

export default CreateProductCategoryModal;
