import React from "react";
import {
  FormModal,
  LoadingBackdrop,
  ModalController,
  ModalControllerHandle,
  ModalControllerProps,
  ModalProps,
} from "~/ui";
import {
  ProductCategory,
  useUpdateProductCategoryMutation,
} from "~/services/product-categories.service";
import ProductCategoryForm, {
  ProductCategoryFormProps,
  ProductCategorySubmitData,
} from "./form";
import { APIError } from "~/services/helpers/transform-response.helper";
import { useUploadImageMutation } from "~/services/upload.service";
import ModalErrorCatcher from "~/components/error-catcher/modal";
import { IMAGE_FILE_SIZE } from "@monorepo/common";

export interface UpdateProductCategoryModalProps
  extends Pick<ModalProps, "onClose">,
    Pick<ModalControllerProps, "children"> {
  category: ProductCategory;
  children: ModalControllerHandle;
}

export const UpdateProductCategoryModal: React.FC<
  UpdateProductCategoryModalProps
> = ({ category, children, onClose }) => {
  const [error, setError] = React.useState<APIError | undefined>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [updateProductCategory] = useUpdateProductCategoryMutation();
  const [uploadImage] = useUploadImageMutation();

  return (
    <>
      <LoadingBackdrop color="secondary" open={loading} />
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={FormModal<ProductCategoryFormProps, ProductCategorySubmitData>}
        ModalProps={{
          onClose,
          Form: ProductCategoryForm,
          FormProps: {
            category,
            variant: "update",
            onSubmit: async data => {
              try {
                setLoading(true);

                if (data.image) {
                  if (data.image.size > IMAGE_FILE_SIZE)
                    throw new APIError({
                      statusCode: 1010,
                      error: "Client Error",
                      message: `The image size greater then ${
                        IMAGE_FILE_SIZE / 1024
                      } kb`,
                    });

                  const formData = new FormData();
                  formData.append("file", data.image);

                  const uploadedImage = await uploadImage(formData).unwrap();

                  if (!uploadedImage) return;

                  data.image_url = uploadedImage.url;
                  data.image = undefined;
                }

                await updateProductCategory({
                  uuid: category.uuid,
                  ...data,
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

export default UpdateProductCategoryModal;
