import React from "react";
import {
  FormModal,
  LoadingBackdrop,
  ModalController,
  ModalControllerProps,
  ModalProps,
} from "~/ui";
import { useCreateModifierMutation } from "~/services/modifiers.service";
import ModifierForm, {
  ModifierFormProps,
  ModifierFormSubmitData,
} from "./forms";
import { useGetModifierCategoriesQuery } from "~/services/modifier-categories.service";
import ModalErrorCatcher from "~/components/error-catcher/modal";
import { APIError } from "~/services/helpers/transform-response.helper";
import { IMAGE_FILE_SIZE } from "@monorepo/common";
import { useUploadImageMutation } from "~/services/upload.service";

export interface CreateModifierModalProps
  extends Pick<ModalControllerProps, "children">,
    Pick<ModalProps, "onClose"> {}

export const CreateModifierModal: React.FC<CreateModifierModalProps> = ({
  children,
  onClose,
}) => {
  const [error, setError] = React.useState<APIError>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [createModifier] = useCreateModifierMutation();
  const [uploadImage] = useUploadImageMutation();
  const { data: modifierCategories = [] } = useGetModifierCategoriesQuery();

  return (
    <>
      <LoadingBackdrop color="secondary" open={loading} />
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={FormModal<ModifierFormProps, ModifierFormSubmitData>}
        ModalProps={{
          onClose,
          Form: ModifierForm,
          FormProps: {
            modifierCategories,
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

                await createModifier(value).unwrap();
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

export default CreateModifierModal;
