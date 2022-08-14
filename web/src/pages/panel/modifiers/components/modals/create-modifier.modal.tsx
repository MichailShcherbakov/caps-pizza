import React from "react";
import {
  FormModal,
  ModalController,
  ModalControllerProps,
  ModalProps,
} from "~/ui";
import { useCreateModifierMutation } from "~/services/modifiers.service";
import CreateModifierForm, {
  CreateModifierFormProps,
  CreateModifierFormSubmitData,
} from "../forms/create-modifier.form";
import { useGetModifierCategoriesQuery } from "~/services/modifier-categories.service";
import ModalErrorCatcher from "~/common/components/error-catcher/modal";
import { APIError } from "~/services/helpers/transform-response.helper";

export interface CreateModifierModalProps
  extends Pick<ModalControllerProps, "children">,
    Pick<ModalProps, "onClose">,
    Pick<CreateModifierFormProps, "onSubmit"> {}

export const CreateModifierModal: React.FC<CreateModifierModalProps> = ({
  children,
  onSubmit,
  onClose,
}) => {
  const [error, setError] = React.useState<APIError>();
  const [createModifier] = useCreateModifierMutation();
  const { data: modifierCategories } = useGetModifierCategoriesQuery();

  return (
    <>
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={FormModal}
        ModalProps={{
          onSubmit,
          onClose,
          Form: CreateModifierForm,
          FormProps: {
            modifierCategories,
            onSubmit: async (value: CreateModifierFormSubmitData) => {
              try {
                await createModifier(value).unwrap();
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

export default CreateModifierModal;
