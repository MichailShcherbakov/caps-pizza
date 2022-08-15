import React from "react";
import {
  FormModal,
  LoadingBackdrop,
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
  const [loading, setLoading] = React.useState<boolean>(false);
  const [createModifier] = useCreateModifierMutation();
  const { data: modifierCategories } = useGetModifierCategoriesQuery();

  return (
    <>
      <LoadingBackdrop color="secondary" open={loading} />
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
                setLoading(true);

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
