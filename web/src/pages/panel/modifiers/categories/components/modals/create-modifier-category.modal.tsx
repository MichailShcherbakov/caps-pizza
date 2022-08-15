import React from "react";
import {
  FormModal,
  LoadingBackdrop,
  ModalController,
  ModalControllerProps,
  ModalProps,
} from "~/ui";
import { useCreateModifierCategoryMutation } from "~/services/modifier-categories.service";
import CreateModifierCategoryForm, {
  CreateModifierCategoryFormProps,
  CreateModifierCategoryFormSubmitData,
} from "../forms/create-modifier-category.form";
import { APIError } from "~/services/helpers/transform-response.helper";
import ModalErrorCatcher from "~/common/components/error-catcher/modal";

export interface CreateModifierCategoryModalProps
  extends Pick<ModalControllerProps, "children">,
    Pick<ModalProps, "onClose">,
    Pick<CreateModifierCategoryFormProps, "onSubmit"> {}

export const CreateModifierCategoryModal: React.FC<
  CreateModifierCategoryModalProps
> = ({ children, onSubmit, onClose }) => {
  const [error, setError] = React.useState<APIError>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [createModifierCategory] = useCreateModifierCategoryMutation();

  return (
    <>
      <LoadingBackdrop color="secondary" open={loading} />
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={FormModal}
        ModalProps={{
          onSubmit,
          onClose,
          Form: CreateModifierCategoryForm,
          FormProps: {
            onSubmit: async (value: CreateModifierCategoryFormSubmitData) => {
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
