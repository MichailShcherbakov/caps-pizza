import React from "react";
import {
  FormModal,
  ModalController,
  ModalControllerProps,
  ModalProps,
} from "~/ui";
import {
  ProductCategory,
  useUpdateProductCategoryMutation,
} from "~/services/product-categories.service";
import UpdateProductCategoryForm, {
  UpdateProductCategoryFormProps,
  UpdateProductCategorySubmitData,
} from "../forms/update-product-category.form";
import { APIError } from "~/services/helpers/transform-response.helper";
import {
  IMAGE_FILE_SIZE,
  useUploadImageMutation,
} from "~/services/upload.service";
import ModalErrorCatcher from "~/common/components/error-catcher/modal";

export interface UpdateProductCategoryModalProps
  extends Pick<ModalControllerProps, "children">,
    Pick<UpdateProductCategoryFormProps, "onSubmit">,
    Pick<ModalProps, "onClose"> {
  category: ProductCategory;
}

export const UpdateProductCategoryModal: React.FC<
  UpdateProductCategoryModalProps
> = ({ category, children, onSubmit, onClose }) => {
  const [error, setError] = React.useState<APIError | undefined>();
  const [updateProductCategory] = useUpdateProductCategoryMutation();
  const [uploadImage] = useUploadImageMutation();

  return (
    <>
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={FormModal}
        ModalProps={{
          onClose,
          onSubmit,
          Form: UpdateProductCategoryForm,
          FormProps: {
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

                await updateProductCategory(category).unwrap();
              } catch (e) {
                setError(e);
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

export default UpdateProductCategoryModal;
