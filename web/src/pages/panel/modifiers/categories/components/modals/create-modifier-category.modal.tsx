import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { ModalController } from "~/ui";
import { useCreateModifierCategoryMutation } from "~/services/modifier-categories.service";
import ErrorHandler from "~/common/components/error-handler";
import CreateModifierCategoryForm from "./create-modifier-category.form";
import { APIResult } from "~/services/helpers/transform-response.helper";
import { UnknownApiError } from "~/common/components/error-handler/api-errors";
import { TheNameAlreadyExistsApiError } from "../api-errors";

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
      <ErrorHandler error={error}>
        <TheNameAlreadyExistsApiError />
        <UnknownApiError />
      </ErrorHandler>
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
