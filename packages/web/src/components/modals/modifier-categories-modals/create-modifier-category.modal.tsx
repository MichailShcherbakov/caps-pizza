import React from "react";
import {
  FormModal,
  LoadingBackdrop,
  ModalController,
  ModalControllerProps,
  ModalProps,
} from "~/ui";
import { useCreateModifierCategoryMutation } from "~/services/modifier-categories.service";
import ModifierCategoryForm, {
  ModifierCategoryFormProps,
  ModifierCategoryFormSubmitData,
} from "./forms";
import { APIError } from "~/services/helpers/transform-response.helper";
import ModalErrorCatcher from "~/components/error-catcher/modal";

export interface CreateModifierCategoryModalProps
  extends Pick<
      ModalControllerProps<CreateModifierCategoryModalProps>,
      "children"
    >,
    Pick<ModalProps, "onClose"> {}

export const CreateModifierCategoryModal: React.FC<
  CreateModifierCategoryModalProps
> = ({ children, onClose }) => {
  const [error, setError] = React.useState<APIError>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [createModifierCategory] = useCreateModifierCategoryMutation();

  return (
    <>
      <LoadingBackdrop color="secondary" open={loading} />
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={
          FormModal<ModifierCategoryFormProps, ModifierCategoryFormSubmitData>
        }
        ModalProps={{
          onClose,
          Form: ModifierCategoryForm,
          FormProps: {
            onSubmit: async value => {
              try {
                setLoading(true);

                await createModifierCategory(value).unwrap();
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

export default CreateModifierCategoryModal;
