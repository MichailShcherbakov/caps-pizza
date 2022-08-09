import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { ModalController } from "~/ui";
import {
  ModifierCategory,
  useUpdateModifierCategoryMutation,
} from "~/services/modifier-categories.service";
import ErrorHandler from "~/common/components/error-handler";
import UpdateModifierCategoryForm from "./update-modifier-category.form";
import { APIResult } from "~/services/helpers/transform-response.helper";
import { UnknownApiError } from "~/common/components/error-handler/api-errors";
import { TheNameAlreadyExistsApiError } from "../api-errors";

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
      <ErrorHandler error={error}>
        <TheNameAlreadyExistsApiError />
        <UnknownApiError />
      </ErrorHandler>
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
