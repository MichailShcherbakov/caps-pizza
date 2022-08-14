import React from "react";
import {
  FormModal,
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
  const [createModifierCategory] = useCreateModifierCategoryMutation();

  return (
    <>
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
                await createModifierCategory(value).unwrap();
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

export default CreateModifierCategoryModal;
