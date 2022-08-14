import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { ModalController } from "~/ui";
import { useCreateModifierMutation } from "~/services/modifiers.service";
import CreateModifierForm from "./create-modifier.form";
import { APIResult } from "~/services/helpers/transform-response.helper";
import { useGetModifierCategoriesQuery } from "~/services/modifier-categories.service";
import ModalErrorCatcher from "~/common/components/error-catcher/modal";

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
      <ModalErrorCatcher error={error} />
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
