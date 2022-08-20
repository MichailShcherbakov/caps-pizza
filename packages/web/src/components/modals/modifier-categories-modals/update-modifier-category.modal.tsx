import React from "react";
import {
  FormModal,
  LoadingBackdrop,
  ModalController,
  ModalControllerProps,
  ModalProps,
} from "~/ui";
import {
  ModifierCategory,
  useUpdateModifierCategoryMutation,
} from "~/services/modifier-categories.service";
import UpdateModifierCategoryForm, {
  UpdateModifierCategoryFormProps,
  UpdateModifierCategoryFormSubmitData,
} from "./forms/update-modifier-category.form";
import { APIError } from "~/services/helpers/transform-response.helper";
import ModalErrorCatcher from "~/components/error-catcher/modal";

export interface UpdateModifierCategoryModalProps
  extends Pick<
      ModalControllerProps<UpdateModifierCategoryModalProps>,
      "children"
    >,
    Pick<ModalProps, "onClose"> {
  category: ModifierCategory;
}

export const UpdateModifierCategoryModal: React.FC<
  UpdateModifierCategoryModalProps
> = ({ category, children, onClose }) => {
  const [error, setError] = React.useState<APIError>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [updateModifierCategory] = useUpdateModifierCategoryMutation();

  return (
    <>
      <LoadingBackdrop color="secondary" open={loading} />
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={
          FormModal<
            UpdateModifierCategoryFormProps,
            UpdateModifierCategoryFormSubmitData
          >
        }
        ModalProps={{
          onClose,
          Form: UpdateModifierCategoryForm,
          FormProps: {
            category,
            onSubmit: async value => {
              try {
                setLoading(true);

                await updateModifierCategory({
                  ...category,
                  ...value,
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

export default UpdateModifierCategoryModal;
