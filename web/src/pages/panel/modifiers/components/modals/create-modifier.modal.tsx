import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { ModalController } from "~/ui";
import { useCreateModifierMutation } from "~/services/modifiers.service";
import ErrorHandler from "~/common/components/error-handler";
import CreateModifierForm from "./create-modifier.form";
import { APIResult } from "~/services/helpers/transform-response.helper";
import { UnknownApiError } from "~/common/components/error-handler/api-errors";
import {
  TheArticleNumberAlreadyExistsApiError,
  TheModifierCategoryNotFoundApiError,
  TheNameAlreadyExistsApiError,
} from "../api-errors";
import { useGetModifierCategoriesQuery } from "~/services/modifier-categories.service";

export interface CreateModifierModalProps extends ButtonProps {}

export const CreateModifierModal: React.FC<
  CreateModifierModalProps
> = props => {
  const [createModifier, result] = useCreateModifierMutation();
  const { data: modifierCategories } = useGetModifierCategoriesQuery();

  const { error } = result as APIResult;

  const modalController = React.useCallback(
    ({ open }) => (
      <Button {...props} variant="contained" color="secondary" onClick={open}>
        Добавить
      </Button>
    ),
    [props]
  );

  const createModifierFormProps = React.useMemo(
    () => ({
      modifierCategories,
      onSubmit: value => {
        createModifier(value);
      },
    }),
    [modifierCategories, createModifier]
  );

  return (
    <>
      <ErrorHandler error={error}>
        <TheModifierCategoryNotFoundApiError />
        <TheNameAlreadyExistsApiError />
        <TheArticleNumberAlreadyExistsApiError />
        <UnknownApiError />
      </ErrorHandler>
      <ModalController
        Modal={CreateModifierForm}
        ModalProps={createModifierFormProps}
      >
        {modalController}
      </ModalController>
    </>
  );
};

export default CreateModifierModal;
