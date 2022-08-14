import React from "react";
import {
  FormModal,
  ModalController,
  ModalControllerProps,
  ModalProps,
} from "~/ui";
import {
  Modifier,
  useUpdateModifierMutation,
} from "~/services/modifiers.service";
import UpdateModifierForm, {
  UpdateModifierFormProps,
  UpdateModifierFormSubmitData,
} from "../forms/update-modifier.form";
import { APIError } from "~/services/helpers/transform-response.helper";
import { useGetModifierCategoriesQuery } from "~/services/modifier-categories.service";
import ModalErrorCatcher from "~/common/components/error-catcher/modal";

export interface UpdateModifierModalProps
  extends Pick<ModalControllerProps, "children">,
    Pick<ModalProps, "onClose">,
    Pick<UpdateModifierFormProps, "onSubmit"> {
  modifier: Modifier;
}

export const UpdateModifierModal: React.FC<UpdateModifierModalProps> = ({
  modifier,
  children,
  onSubmit,
  onClose,
}) => {
  const [error, setError] = React.useState<APIError>();
  const [updateModifier] = useUpdateModifierMutation();
  const { data: modifierCategories } = useGetModifierCategoriesQuery();

  return (
    <>
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={FormModal}
        ModalProps={{
          onSubmit,
          onClose,
          Form: UpdateModifierForm,
          FormProps: {
            modifier,
            modifierCategories,
            onSubmit: async (value: UpdateModifierFormSubmitData) => {
              try {
                await updateModifier({ ...modifier, ...value }).unwrap();
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

export default UpdateModifierModal;
