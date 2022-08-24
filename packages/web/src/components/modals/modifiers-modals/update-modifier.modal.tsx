import React from "react";
import {
  FormModal,
  LoadingBackdrop,
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
} from "./forms/update-modifier.form";
import { APIError } from "~/services/helpers/transform-response.helper";
import { useGetModifierCategoriesQuery } from "~/services/modifier-categories.service";
import ModalErrorCatcher from "~/components/error-catcher/modal";

export interface UpdateModifierModalProps
  extends Pick<ModalControllerProps, "children">,
    Pick<ModalProps, "onClose"> {
  modifier: Modifier;
}

export const UpdateModifierModal: React.FC<UpdateModifierModalProps> = ({
  modifier,
  children,
  onClose,
}) => {
  const [error, setError] = React.useState<APIError>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [updateModifier] = useUpdateModifierMutation();
  const { data: modifierCategories = [] } = useGetModifierCategoriesQuery();

  return (
    <>
      <LoadingBackdrop color="secondary" open={loading} />
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={FormModal<UpdateModifierFormProps, UpdateModifierFormSubmitData>}
        ModalProps={{
          onClose,
          Form: UpdateModifierForm,
          FormProps: {
            modifier,
            modifierCategories,
            onSubmit: async value => {
              try {
                setLoading(true);

                await updateModifier({ ...modifier, ...value }).unwrap();
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

export default UpdateModifierModal;