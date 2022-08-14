import React from "react";
import {
  FormModal,
  ModalController,
  ModalControllerProps,
  ModalProps,
} from "~/ui";
import {
  ModifierCategory,
  useUpdateModifierCategoryMutation,
} from "~/services/modifier-categories.service";
import UpdateModifierCategoryForm, {
  UpdateModifierCategoryFormSubmitData,
} from "../forms/update-modifier-category.form";
import { APIError } from "~/services/helpers/transform-response.helper";
import ModalErrorCatcher from "~/common/components/error-catcher/modal";
import { CreateModifierCategoryFormProps } from "../forms/create-modifier-category.form";

export interface UpdateModifierCategoryModalProps
  extends Pick<ModalControllerProps, "children">,
    Pick<ModalProps, "onClose">,
    Pick<CreateModifierCategoryFormProps, "onSubmit"> {
  category: ModifierCategory;
}

export const UpdateModifierCategoryModal: React.FC<
  UpdateModifierCategoryModalProps
> = ({ category, children, onSubmit, onClose }) => {
  const [error, setError] = React.useState<APIError>();
  const [updateModifierCategory] = useUpdateModifierCategoryMutation();

  return (
    <>
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={FormModal}
        ModalProps={{
          onSubmit,
          onClose,
          Form: UpdateModifierCategoryForm,
          FormProps: {
            category,
            onSubmit: async (value: UpdateModifierCategoryFormSubmitData) => {
              try {
                await updateModifierCategory({
                  ...category,
                  ...value,
                }).unwrap();
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

export default UpdateModifierCategoryModal;
