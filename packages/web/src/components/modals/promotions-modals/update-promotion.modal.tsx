import React from "react";
import {
  FormModal,
  LoadingBackdrop,
  ModalController,
  ModalControllerProps,
  ModalProps,
} from "~/ui";
import {
  Promotion,
  useUpdatePromotionMutation,
} from "~/services/promotions.service";
import PromotionForm, {
  PromotionFormProps,
  PromotionFormSubmitData,
} from "./forms";
import { APIError } from "~/services/helpers/transform-response.helper";
import ModalErrorCatcher from "~/components/error-catcher/modal";
import { useUploadImageMutation } from "~/services/upload.service";
import { IMAGE_FILE_SIZE } from "@monorepo/common";

export interface UpdatePromotionModalProps
  extends Pick<ModalControllerProps, "children">,
    Pick<ModalProps, "onClose"> {
  promotion: Promotion;
}

export const UpdatePromotionModal: React.FC<UpdatePromotionModalProps> = ({
  promotion,
  children,
  onClose,
}) => {
  const [error, setError] = React.useState<APIError>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [uploadImage] = useUploadImageMutation();
  const [updatePromotion] = useUpdatePromotionMutation();

  return (
    <>
      <LoadingBackdrop color="secondary" open={loading} />
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={FormModal<PromotionFormProps, PromotionFormSubmitData>}
        ModalProps={{
          onClose,
          Form: PromotionForm,
          FormProps: {
            promotion,
            variant: "update",
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

                await updatePromotion({ ...promotion, ...value }).unwrap();
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

export default UpdatePromotionModal;
