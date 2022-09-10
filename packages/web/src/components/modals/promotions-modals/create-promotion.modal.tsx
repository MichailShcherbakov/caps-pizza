import React from "react";
import {
  FormModal,
  LoadingBackdrop,
  ModalController,
  ModalControllerProps,
  ModalProps,
} from "~/ui";
import { useCreatePromotionMutation } from "~/services/promotions.service";
import PromotionForm, {
  PromotionFormProps,
  PromotionFormSubmitData,
} from "./forms";
import ModalErrorCatcher from "~/components/error-catcher/modal";
import { APIError } from "~/services/helpers/transform-response.helper";
import { IMAGE_FILE_SIZE } from "@monorepo/common";
import { useUploadImageMutation } from "~/services/upload.service";

export interface CreatePromotionModalProps
  extends Pick<ModalControllerProps, "children">,
    Pick<ModalProps, "onClose"> {}

export const CreatePromotionModal: React.FC<CreatePromotionModalProps> = ({
  children,
  onClose,
}) => {
  const [error, setError] = React.useState<APIError>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [uploadImage] = useUploadImageMutation();
  const [createPromotion] = useCreatePromotionMutation();

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
            variant: "create",
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

                await createPromotion({
                  name: value.name,
                  image_url: uploadedImage.url,
                  display: value.display,
                  display_position: value.display_position,
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

export default CreatePromotionModal;
