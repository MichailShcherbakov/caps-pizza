import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { ModalController } from "~/ui";
import {
  ModifierCategory,
  useUpdateModifierCategoryMutation,
} from "~/services/modifier-categories.service";
import UpdateModifierCategoryForm from "./update-modifier-category.form";
import { APIResult } from "~/services/helpers/transform-response.helper";
import ModalErrorCatcher from "~/common/components/error-catcher/modal";

export interface UpdateModifierCategoryModalProps extends ButtonProps {
  category: ModifierCategory;
}

export const UpdateModifierCategoryModal: React.FC<
  UpdateModifierCategoryModalProps
> = ({ category, ...props }) => {
  const [updateModifierCategory, result] = useUpdateModifierCategoryMutation();

  const { error } = result as APIResult;

  const modalController = React.useCallback(
    ({ open }) => (
      <Button
        {...props}
        variant="outlined"
        color="warning"
        size="small"
        onClick={open}
      >
        Изменить
      </Button>
    ),
    [props]
  );

  return (
    <>
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={UpdateModifierCategoryForm}
        ModalProps={{
          category,
          onSubmit: value => {
            updateModifierCategory({ ...category, ...value });
          },
        }}
      >
        {modalController}
      </ModalController>
    </>
  );
};

export default UpdateModifierCategoryModal;
