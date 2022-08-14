import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { ModalController } from "~/ui";
import { useCreateModifierCategoryMutation } from "~/services/modifier-categories.service";
import CreateModifierCategoryForm from "./create-modifier-category.form";
import { APIResult } from "~/services/helpers/transform-response.helper";
import ModalErrorCatcher from "~/common/components/error-catcher/modal";

export interface CreateModifierCategoryModalProps extends ButtonProps {}

export const CreateModifierCategoryModal: React.FC<
  CreateModifierCategoryModalProps
> = props => {
  const [createModifierCategory, result] = useCreateModifierCategoryMutation();

  const { error } = result as APIResult;

  const modalController = React.useCallback(
    ({ open }) => (
      <Button {...props} variant="contained" color="secondary" onClick={open}>
        Добавить
      </Button>
    ),
    [props]
  );

  const createModifierCategoryFormProps = React.useMemo(
    () => ({
      onSubmit: value => {
        createModifierCategory(value);
      },
    }),
    [createModifierCategory]
  );

  return (
    <>
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={CreateModifierCategoryForm}
        ModalProps={createModifierCategoryFormProps}
      >
        {modalController}
      </ModalController>
    </>
  );
};

export default CreateModifierCategoryModal;
